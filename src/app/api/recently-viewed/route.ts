import { NextRequest } from "next/server";
import { db } from "@/db";
import { recentlyViewed, designs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUserFromRequest, apiResponse, apiError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const viewed = await db
      .select({ viewed: recentlyViewed, design: designs })
      .from(recentlyViewed)
      .innerJoin(designs, eq(recentlyViewed.designId, designs.id))
      .where(eq(recentlyViewed.userId, payload.userId))
      .orderBy(desc(recentlyViewed.viewedAt))
      .limit(8);

    return apiResponse(
      viewed.map((v) => ({ ...v.design, viewedAt: v.viewed.viewedAt })),
      "Recently viewed fetched"
    );
  } catch (error) {
    console.error("Recently viewed error:", error);
    return apiError("Internal server error", 500);
  }
}
