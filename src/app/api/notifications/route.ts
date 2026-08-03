import { NextRequest } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getUserFromRequest, apiResponse, apiError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, payload.userId))
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    return apiResponse(userNotifications, "Notifications fetched");
  } catch (error) {
    console.error("Get notifications error:", error);
    return apiError("Internal server error", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload) return apiError("Unauthorized", 401);

    const { notificationId } = await req.json();

    if (notificationId) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, notificationId));
    } else {
      // Mark all as read
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, payload.userId));
    }

    return apiResponse(null, "Notifications marked as read");
  } catch (error) {
    console.error("Update notifications error:", error);
    return apiError("Internal server error", 500);
  }
}
