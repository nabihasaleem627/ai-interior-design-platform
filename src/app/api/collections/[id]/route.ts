import { NextRequest } from "next/server";
import { db } from "@/db";
import { collections, collectionItems, designs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserFromRequest, apiResponse, apiError } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collectionId = parseInt(id);
    if (isNaN(collectionId)) return apiError("Invalid collection ID", 400);

    const payload = await getUserFromRequest(req);

    const [collection] = await db
      .select()
      .from(collections)
      .where(eq(collections.id, collectionId))
      .limit(1);

    if (!collection) return apiError("Collection not found", 404);

    // Only owner or public
    if (!collection.isPublic && collection.userId !== payload?.userId) {
      return apiError("Forbidden", 403);
    }

    const items = await db
      .select({ item: collectionItems, design: designs })
      .from(collectionItems)
      .innerJoin(designs, eq(collectionItems.designId, designs.id))
      .where(eq(collectionItems.collectionId, collectionId));

    return apiResponse(
      {
        ...collection,
        items: items.map((i) => ({ ...i.design, itemId: i.item.id })),
      },
      "Collection fetched"
    );
  } catch (error) {
    console.error("Get collection error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const { id } = await params;
    const collectionId = parseInt(id);
    if (isNaN(collectionId)) return apiError("Invalid ID", 400);

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

    const body = await req.json();
    const { name, description, isPublic } = body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const [updated] = await db
      .update(collections)
      .set(updateData)
      .where(eq(collections.id, collectionId))
      .returning();

    return apiResponse(updated, "Collection updated");
  } catch (error) {
    console.error("Update collection error:", error);
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
    if (isNaN(collectionId)) return apiError("Invalid ID", 400);

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

    await db.delete(collections).where(eq(collections.id, collectionId));

    return apiResponse(null, "Collection deleted");
  } catch (error) {
    console.error("Delete collection error:", error);
    return apiError("Internal server error", 500);
  }
}
