import { NextRequest } from "next/server";
import { db } from "@/db";
import { designs } from "@/db/schema";
import { apiResponse, apiError } from "@/lib/auth";
import { DESIGN_SEED } from "@/lib/seed-data";
import { sql } from "drizzle-orm";

export async function POST(_req: NextRequest) {
  try {
    const existing = await db
      .select({ count: sql<number>`count(*)` })
      .from(designs);
    const count = Number(existing[0]?.count ?? 0);

    if (count > 0) {
      return apiResponse({ count }, "Designs already seeded");
    }

    const seeded = await db
      .insert(designs)
      .values(
        DESIGN_SEED.map((d, i) => ({
          ...d,
          rating: (3.5 + Math.random() * 1.5).toFixed(2),
          viewCount: Math.floor(Math.random() * 5000) + 100,
          likeCount: Math.floor(Math.random() * 1000) + 10,
          isAiGenerated: false,
          createdAt: new Date(Date.now() - i * 86400000 * 3),
        }))
      )
      .returning();

    return apiResponse({ count: seeded.length }, "Designs seeded successfully", 201);
  } catch (error) {
    console.error("Seed error:", error);
    return apiError("Internal server error", 500);
  }
}
