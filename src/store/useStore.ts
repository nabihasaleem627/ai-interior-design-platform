"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  preferredStyles?: string[];
  preferredRooms?: string[];
  budgetPreference?: string;
  theme?: string;
  createdAt: string;
}

export interface Design {
  id: number;
  title: string;
  description: string;
  roomType: string;
  style: string;
  images: string[];
  colorPalette: string[];
  furniture: string[];
  materials: string[];
  budgetCategory: string;
  estimatedBudget?: string | null;
  designerName?: string | null;
  designerNotes?: string | null;
  rating?: string | null;
  viewCount?: number | null;
  likeCount?: number | null;
  tags?: string[];
  isAiGenerated?: boolean;
  createdAt: string;
}

export interface Collection {
  id: number;
  userId: number;
  name: string;
  description?: string | null;
  coverImage?: string | null;
  isPublic?: boolean;
  shareToken?: string | null;
  itemCount?: number;
  previewImages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AiRecommendation {
  id: number;
  userId: number;
  prompt: string;
  style?: string | null;
  roomType?: string | null;
  colors?: string[];
  budget?: string | null;
  result?: Record<string, unknown> | null;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead?: boolean;
  createdAt: string;
}

export interface SearchFilters {
  search: string;
  style: string;
  roomType: string;
  budgetCategory: string;
  colorPalette: string;
  sortBy: string;
}

// ─── Store Interface ────────────────────────────────────────────────────────────
interface AppStore {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;

  // Theme
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

  // Designs
  designs: Design[];
  setDesigns: (designs: Design[]) => void;
  selectedDesign: Design | null;
  setSelectedDesign: (design: Design | null) => void;
  recentlyViewed: Design[];
  setRecentlyViewed: (designs: Design[]) => void;

  // Favorites
  favorites: Design[];
  favoriteIds: Set<number>;
  setFavorites: (designs: Design[]) => void;
  addFavorite: (design: Design) => void;
  removeFavorite: (designId: number) => void;
  isFavorite: (designId: number) => boolean;

  // Collections
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (id: number, data: Partial<Collection>) => void;
  removeCollection: (id: number) => void;

  // AI Recommendations
  aiRecommendations: AiRecommendation[];
  setAiRecommendations: (recs: AiRecommendation[]) => void;
  addAiRecommendation: (rec: AiRecommendation) => void;
  currentAiResult: Record<string, unknown> | null;
  setCurrentAiResult: (result: Record<string, unknown> | null) => void;

  // Search Filters
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  unreadCount: number;
  markAsRead: (id?: number) => void;

  // UI State
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  compareDesigns: [Design | null, Design | null];
  setCompareDesign: (slot: 0 | 1, design: Design | null) => void;
}

const defaultFilters: SearchFilters = {
  search: "",
  style: "",
  roomType: "",
  budgetCategory: "",
  colorPalette: "",
  sortBy: "newest",
};

// ─── Store ─────────────────────────────────────────────────────────────────────
export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          favorites: [],
          favoriteIds: new Set(),
          collections: [],
          aiRecommendations: [],
          notifications: [],
          unreadCount: 0,
        }),

      // Theme
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      // Designs
      designs: [],
      setDesigns: (designs) => set({ designs }),
      selectedDesign: null,
      setSelectedDesign: (design) => set({ selectedDesign: design }),
      recentlyViewed: [],
      setRecentlyViewed: (designs) => set({ recentlyViewed: designs }),

      // Favorites
      favorites: [],
      favoriteIds: new Set<number>(),
      setFavorites: (designs) =>
        set({
          favorites: designs,
          favoriteIds: new Set(designs.map((d) => d.id)),
        }),
      addFavorite: (design) =>
        set((state) => ({
          favorites: [design, ...state.favorites],
          favoriteIds: new Set([...state.favoriteIds, design.id]),
        })),
      removeFavorite: (designId) =>
        set((state) => {
          const newIds = new Set(state.favoriteIds);
          newIds.delete(designId);
          return {
            favorites: state.favorites.filter((d) => d.id !== designId),
            favoriteIds: newIds,
          };
        }),
      isFavorite: (designId) => get().favoriteIds.has(designId),

      // Collections
      collections: [],
      setCollections: (collections) => set({ collections }),
      addCollection: (collection) =>
        set((state) => ({ collections: [collection, ...state.collections] })),
      updateCollection: (id, data) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
      removeCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),

      // AI Recommendations
      aiRecommendations: [],
      setAiRecommendations: (recs) => set({ aiRecommendations: recs }),
      addAiRecommendation: (rec) =>
        set((state) => ({
          aiRecommendations: [rec, ...state.aiRecommendations],
        })),
      currentAiResult: null,
      setCurrentAiResult: (result) => set({ currentAiResult: result }),

      // Search Filters
      filters: defaultFilters,
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: defaultFilters }),

      // Notifications
      notifications: [],
      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        }),
      unreadCount: 0,
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            id === undefined || n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: id
            ? Math.max(0, state.unreadCount - 1)
            : 0,
        })),

      // UI State
      isSearchOpen: false,
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),
      compareDesigns: [null, null],
      setCompareDesign: (slot, design) =>
        set((state) => {
          const newCompare: [Design | null, Design | null] = [...state.compareDesigns];
          newCompare[slot] = design;
          return { compareDesigns: newCompare };
        }),
    }),
    {
      name: "interior-design-store",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        favoriteIds: Array.from(state.favoriteIds),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.favoriteIds)) {
          state.favoriteIds = new Set(state.favoriteIds as unknown as number[]);
        }
      },
    }
  )
);
