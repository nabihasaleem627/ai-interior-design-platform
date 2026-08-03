import { NextRequest } from "next/server";
import { db } from "@/db";
import { designs } from "@/db/schema";
import { ilike, and, eq, desc, asc, sql } from "drizzle-orm";
import { apiResponse, apiError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const style = searchParams.get("style") || "";
    const roomType = searchParams.get("roomType") || "";
    const budgetCategory = searchParams.get("budgetCategory") || "";
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (search) {
      conditions.push(ilike(designs.title, `%${search}%`));
    }
    if (style) {
      conditions.push(eq(designs.style, style));
    }
    if (roomType) {
      conditions.push(eq(designs.roomType, roomType));
    }
    if (budgetCategory) {
      conditions.push(eq(designs.budgetCategory, budgetCategory));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (sortBy) {
      case "popular":
        orderBy = desc(designs.likeCount);
        break;
      case "rated":
        orderBy = desc(designs.rating);
        break;
      case "oldest":
        orderBy = asc(designs.createdAt);
        break;
      default:
        orderBy = desc(designs.createdAt);
    }

    const [allDesigns, countResult] = await Promise.all([
      db
        .select()
        .from(designs)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(designs)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return apiResponse(
      {
        designs: allDesigns,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Designs fetched"
    );
  } catch (error) {
    console.error("Get designs error:", error);
    return apiError("Internal server error", 500);
  }
}
