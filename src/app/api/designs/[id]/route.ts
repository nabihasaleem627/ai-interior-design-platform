import { NextRequest } from "next/server";
import { db } from "@/db";
import { designs, recentlyViewed } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { apiResponse, apiError, getUserFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const designId = parseInt(id);
    if (isNaN(designId)) return apiError("Invalid design ID", 400);

    const [design] = await db
      .select()
      .from(designs)
      .where(eq(designs.id, designId))
      .limit(1);

    if (!design) return apiError("Design not found", 404);

    // Increment view count
    await db
      .update(designs)
      .set({ viewCount: (design.viewCount ?? 0) + 1 })
      .where(eq(designs.id, designId));

    // Track recently viewed if authenticated
    const payload = await getUserFromRequest(req);
    if (payload) {
      // Check if already recently viewed
      const existing = await db
        .select()
        .from(recentlyViewed)
        .where(
          and(
            eq(recentlyViewed.userId, payload.userId),
            eq(recentlyViewed.designId, designId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(recentlyViewed)
          .set({ viewedAt: new Date() })
          .where(eq(recentlyViewed.id, existing[0].id));
      } else {
        await db.insert(recentlyViewed).values({
          userId: payload.userId,
          designId,
        });
      }
    }

    return apiResponse(
      { ...design, viewCount: (design.viewCount ?? 0) + 1 },
      "Design fetched"
    );
  } catch (error) {
    console.error("Get design error:", error);
    return apiError("Internal server error", 500);
  }
}
