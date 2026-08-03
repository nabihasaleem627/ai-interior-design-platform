import { NextRequest } from "next/server";
import { db } from "@/db";
import { collections, collectionItems, designs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserFromRequest, apiResponse, apiError } from "@/lib/auth";
import { generateToken } from "@/lib/utils";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const userCollections = await db
      .select()
      .from(collections)
      .where(eq(collections.userId, payload.userId));

    // Get item counts and first image for each collection
    const collectionsWithDetails = await Promise.all(
      userCollections.map(async (col) => {
        const items = await db
          .select({ design: designs })
          .from(collectionItems)
          .innerJoin(designs, eq(collectionItems.designId, designs.id))
          .where(eq(collectionItems.collectionId, col.id));

        return {
          ...col,
          itemCount: items.length,
          coverImage: col.coverImage || items[0]?.design.images[0] || null,
          previewImages: items.slice(0, 4).map((i) => i.design.images[0]),
        };
      })
    );

    return apiResponse(collectionsWithDetails, "Collections fetched");
  } catch (error) {
    console.error("Get collections error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message, 400);

    const [collection] = await db
      .insert(collections)
      .values({
        userId: payload.userId,
        name: parsed.data.name,
        description: parsed.data.description,
        isPublic: parsed.data.isPublic,
        shareToken: generateToken(32),
      })
      .returning();

    return apiResponse(collection, "Collection created", 201);
  } catch (error) {
    console.error("Create collection error:", error);
    return apiError("Internal server error", 500);
  }
}
