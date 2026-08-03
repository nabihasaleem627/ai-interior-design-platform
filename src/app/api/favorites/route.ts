import { NextRequest } from "next/server";
import { db } from "@/db";
import { favorites, designs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserFromRequest, apiResponse, apiError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const userFavorites = await db
      .select({ favorite: favorites, design: designs })
      .from(favorites)
      .innerJoin(designs, eq(favorites.designId, designs.id))
      .where(eq(favorites.userId, payload.userId));

    return apiResponse(
      userFavorites.map((f) => ({ ...f.design, favoriteId: f.favorite.id })),
      "Favorites fetched"
    );
  } catch (error) {
    console.error("Get favorites error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const { designId } = await req.json();
    if (!designId) return apiError("designId is required", 400);

    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, payload.userId),
          eq(favorites.designId, designId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return apiError("Already in favorites", 409);
    }

    const [favorite] = await db
      .insert(favorites)
      .values({ userId: payload.userId, designId })
      .returning();

    return apiResponse(favorite, "Added to favorites", 201);
  } catch (error) {
    console.error("Add favorite error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const designId = parseInt(searchParams.get("designId") || "");
    if (isNaN(designId)) return apiError("Invalid designId", 400);

    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, payload.userId),
          eq(favorites.designId, designId)
        )
      );

    return apiResponse(null, "Removed from favorites");
  } catch (error) {
    console.error("Delete favorite error:", error);
    return apiError("Internal server error", 500);
  }
}
