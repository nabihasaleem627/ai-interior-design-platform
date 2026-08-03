import { NextRequest } from "next/server";
import { db } from "@/db";
import { collections, collectionItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserFromRequest, apiResponse, apiError } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const { id } = await params;
    const collectionId = parseInt(id);
    if (isNaN(collectionId)) return apiError("Invalid collection ID", 400);

    const [collection] = await db
      .select()
      .from(collections)
      .where(
        and(
          eq(collections.id, collectionId),
          eq(collections.userId, payload.userId)
        )
      )
      .limit(1);

    if (!collection) return apiError("Collection not found", 404);

    const { designId } = await req.json();
    if (!designId) return apiError("designId is required", 400);

    const existing = await db
      .select()
      .from(collectionItems)
      .where(
        and(
          eq(collectionItems.collectionId, collectionId),
          eq(collectionItems.designId, designId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return apiError("Design already in collection", 409);
    }

    const [item] = await db
      .insert(collectionItems)
      .values({ collectionId, designId })
      .returning();

    return apiResponse(item, "Added to collection", 201);
  } catch (error) {
    console.error("Add to collection error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const { id } = await params;
    const collectionId = parseInt(id);
    if (isNaN(collectionId)) return apiError("Invalid collection ID", 400);

    const [collection] = await db
      .select()
      .from(collections)
      .where(
        and(
          eq(collections.id, collectionId),
          eq(collections.userId, payload.userId)
        )
      )
      .limit(1);

    if (!collection) return apiError("Collection not found", 404);

    const { searchParams } = new URL(req.url);
    const designId = parseInt(searchParams.get("designId") || "");
    if (isNaN(designId)) return apiError("Invalid designId", 400);

    await db
      .delete(collectionItems)
      .where(
        and(
          eq(collectionItems.collectionId, collectionId),
          eq(collectionItems.designId, designId)
        )
      );

    return apiResponse(null, "Removed from collection");
  } catch (error) {
    console.error("Remove from collection error:", error);
    return apiError("Internal server error", 500);
  }
}
