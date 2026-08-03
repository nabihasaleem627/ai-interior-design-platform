"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { authService, designService, favoriteService, dashboardService } from "@/services/api";

export function AppInitializer() {
  const {
    token,
    isAuthenticated,
    setUser,
    setFavorites,
    setNotifications,
    unreadCount,
  } = useStore();

  // Seed designs on first load
  useEffect(() => {
    designService.seed().catch(() => {});
  }, []);

  // Revalidate auth & load user data
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const loadUserData = async () => {
      try {
        const [meRes, favRes, notifRes] = await Promise.allSettled([
          authService.getMe(token),
          favoriteService.getAll(token),
          dashboardService.getNotifications(token),
        ]);

        if (meRes.status === "fulfilled") {
          setUser(meRes.value.data as Parameters<typeof setUser>[0]);
        }
        if (favRes.status === "fulfilled") {
          setFavorites(favRes.value.data as Parameters<typeof setFavorites>[0]);
        }
        if (notifRes.status === "fulfilled") {
          setNotifications(notifRes.value.data as Parameters<typeof setNotifications>[0]);
        }
      } catch {
        // Silent fail – don't disrupt UX
      }
    };

    loadUserData();
  }, [token, isAuthenticated, setUser, setFavorites, setNotifications]);

  return null;
}
