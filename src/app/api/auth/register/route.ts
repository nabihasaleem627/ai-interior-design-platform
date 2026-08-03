import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signToken, apiResponse, apiError } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { name, email, password } = parsed.data;

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return apiError("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        preferredStyles: [],
        preferredRooms: [],
        budgetPreference: "medium",
        theme: "light",
      })
      .returning();

    const token = signToken({ userId: newUser.id, email: newUser.email });

    const { password: _, ...userWithoutPassword } = newUser;

    return apiResponse({ user: userWithoutPassword, token }, "Account created successfully", 201);
  } catch (error) {
    console.error("Register error:", error);
    return apiError("Internal server error", 500);
  }
}
