import { NextRequest } from "next/server";
import { db } from "@/db";
import { aiRecommendations, designs } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getUserFromRequest, apiResponse, apiError } from "@/lib/auth";

function generateAIRecommendation(
  prompt: string,
  style: string,
  roomType: string,
  colors: string[],
  budget: string
) {
  const styleGuides: Record<string, { furniture: string[]; materials: string[]; tips: string[] }> = {
    Modern: {
      furniture: ["Platform sofa", "Glass coffee table", "Floating shelves", "Accent chair", "Linear pendant"],
      materials: ["Tempered glass", "Polished concrete", "Chrome accents", "Lacquered surfaces", "Leather"],
      tips: ["Keep lines clean and geometric", "Use contrasting textures", "Prioritize functionality"],
    },
    Scandinavian: {
      furniture: ["Low-profile sofa", "Wooden side table", "Sheepskin rug", "Floor lamp", "Open storage"],
      materials: ["Light oak", "Linen", "Wool", "Rattan", "Whitewashed wood"],
      tips: ["Maximize natural light", "Use neutral colors with natural accents", "Choose multifunctional furniture"],
    },
    Minimalist: {
      furniture: ["Platform bed", "Hidden storage", "Simple dining table", "Accent chair", "Minimal shelving"],
      materials: ["Concrete", "White walls", "Natural stone", "Matte finishes", "Simple textiles"],
      tips: ["Edit ruthlessly — keep only essentials", "Use negative space intentionally", "Invest in quality over quantity"],
    },
    Industrial: {
      furniture: ["Steel frame sofa", "Reclaimed wood table", "Metal shelving", "Bar stools", "Factory pendant"],
      materials: ["Exposed brick", "Raw steel", "Reclaimed wood", "Concrete", "Edison bulbs"],
      tips: ["Balance raw materials with soft textiles", "Add vintage industrial finds", "Use warm lighting"],
    },
    Luxury: {
      furniture: ["Bespoke sectional", "Marble coffee table", "Custom cabinetry", "Chaise lounge", "Statement chandelier"],
      materials: ["Marble", "Polished brass", "Cashmere", "Velvet", "Exotic wood"],
      tips: ["Invest in statement pieces", "Layer rich textures", "Commission custom elements"],
    },
    Bohemian: {
      furniture: ["Rattan chairs", "Vintage chest", "Floor cushions", "Hammock chair", "Macramé hanging"],
      materials: ["Jute", "Rattan", "Kilim", "Mixed textiles", "Terracotta"],
      tips: ["Layer patterns fearlessly", "Mix global influences", "Add abundant plants"],
    },
    Japanese: {
      furniture: ["Low platform bed", "Shoji screen", "Tatami mat", "Minimalist desk", "Ikebana display"],
      materials: ["Bamboo", "Rice paper", "Cedar wood", "Natural stone", "Washi"],
      tips: ["Embrace wabi-sabi imperfections", "Incorporate nature elements", "Focus on tranquility and balance"],
    },
    Contemporary: {
      furniture: ["Curved sofa", "Organic coffee table", "Statement lighting", "Accent wall", "Mixed seating"],
      materials: ["Curved forms", "Mixed metals", "Textured fabrics", "Bold colors", "Natural stone"],
      tips: ["Mix old and new elements", "Be bold with one statement piece", "Create visual flow"],
    },
  };

  const budgetRanges: Record<string, { min: number; max: number }> = {
    Budget: { min: 2000, max: 8000 },
    "Mid-Range": { min: 8000, max: 25000 },
    Premium: { min: 25000, max: 60000 },
    Luxury: { min: 60000, max: 150000 },
  };

  const guide = styleGuides[style] || styleGuides["Modern"];
  const range = budgetRanges[budget] || budgetRanges["Mid-Range"];
  const estimatedBudget = Math.floor(
    Math.random() * (range.max - range.min) + range.min
  );

  const colorSuggestions = colors.length > 0 ? colors : ["#F5F0EB", "#D4C5B0", "#8B7355"];

  return {
    title: `${style} ${roomType} Design`,
    description: `A beautifully crafted ${style.toLowerCase()} ${roomType.toLowerCase()} inspired by: "${prompt}". This design embraces the core principles of ${style.toLowerCase()} aesthetics while maintaining practical functionality.`,
    style,
    roomType,
    colorPalette: colorSuggestions,
    furniture: guide.furniture,
    materials: guide.materials,
    designerNotes: guide.tips.join(". ") + ".",
    estimatedBudget,
    budgetCategory: budget,
    keyFeatures: [
      `${style}-inspired aesthetic throughout`,
      `Optimized ${roomType.toLowerCase()} layout`,
      `Cohesive color story`,
      `Curated material palette`,
    ],
    moodKeywords: [style.toLowerCase(), "curated", "intentional", "harmonious"],
    images: [
      `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80`,
      `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80`,
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const body = await req.json();
    const { prompt, style, roomType, colors, budget } = body;

    if (!prompt) return apiError("Prompt is required", 400);

    const recommendation = generateAIRecommendation(
      prompt,
      style || "Modern",
      roomType || "Living Room",
      colors || [],
      budget || "Mid-Range"
    );

    // Find matching designs from DB
    const matchingDesigns = await db
      .select()
      .from(designs)
      .where(
        and(
          style ? eq(designs.style, style) : sql`1=1`,
          roomType ? eq(designs.roomType, roomType) : sql`1=1`
        )
      )
      .limit(4);

    const [saved] = await db
      .insert(aiRecommendations)
      .values({
        userId: payload.userId,
        prompt,
        style,
        roomType,
        colors: colors || [],
        budget,
        result: recommendation,
        savedDesignIds: matchingDesigns.map((d) => d.id),
      })
      .returning();

    return apiResponse(
      {
        recommendation,
        relatedDesigns: matchingDesigns,
        recommendationId: saved.id,
      },
      "AI recommendation generated",
      201
    );
  } catch (error) {
    console.error("AI generate error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const recommendations = await db
      .select()
      .from(aiRecommendations)
      .where(eq(aiRecommendations.userId, payload.userId))
      .orderBy(sql`${aiRecommendations.createdAt} desc`)
      .limit(10);

    return apiResponse(recommendations, "AI recommendations fetched");
  } catch (error) {
    console.error("Get AI recommendations error:", error);
    return apiError("Internal server error", 500);
  }
}
