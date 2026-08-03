import { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserFromRequest, apiResponse, apiError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
    if (!user) return apiError("User not found", 404);

    const { password: _, ...userWithoutPassword } = user;
    return apiResponse(userWithoutPassword, "User fetched");
  } catch (error) {
    console.error("Me error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const body = await req.json();
    const {
      name,
      bio,
      avatar,
      preferredStyles,
      preferredRooms,
      budgetPreference,
      theme,
    } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (preferredStyles !== undefined) updateData.preferredStyles = preferredStyles;
    if (preferredRooms !== undefined) updateData.preferredRooms = preferredRooms;
    if (budgetPreference !== undefined) updateData.budgetPreference = budgetPreference;
    if (theme !== undefined) updateData.theme = theme;

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, payload.userId))
      .returning();

    const { password: _, ...userWithoutPassword } = updated;
    return apiResponse(userWithoutPassword, "Profile updated");
  } catch (error) {
    console.error("Update profile error:", error);
    return apiError("Internal server error", 500);
  }
}
