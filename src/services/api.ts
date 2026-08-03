"use client";

// ─── Base API Client ──────────────────────────────────────────────────────────
const BASE_URL = "/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
}

// ─── Auth Services ────────────────────────────────────────────────────────────
export const authService = {
  register: (name: string, email: string, password: string) =>
    request<{ user: unknown; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ user: unknown; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: (token: string) =>
    request<unknown>("/auth/me", {}, token),

  updateProfile: (token: string, data: Record<string, unknown>) =>
    request<unknown>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }, token),
};

// ─── Design Services ──────────────────────────────────────────────────────────
export interface DesignFilters {
  search?: string;
  style?: string;
  roomType?: string;
  budgetCategory?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const designService = {
  getAll: (filters: DesignFilters = {}, token?: string | null) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    return request<{ designs: unknown[]; pagination: unknown }>(
      `/designs?${params.toString()}`,
      {},
      token
    );
  },

  getById: (id: number, token?: string | null) =>
    request<unknown>(`/designs/${id}`, {}, token),

  seed: () =>
    request<{ count: number }>("/designs/seed", { method: "POST" }),
};

// ─── Favorites Services ───────────────────────────────────────────────────────
export const favoriteService = {
  getAll: (token: string) => request<unknown[]>("/favorites", {}, token),

  add: (token: string, designId: number) =>
    request<unknown>("/favorites", {
      method: "POST",
      body: JSON.stringify({ designId }),
    }, token),

  remove: (token: string, designId: number) =>
    request<null>(`/favorites?designId=${designId}`, {
      method: "DELETE",
    }, token),
};

// ─── Collections Services ─────────────────────────────────────────────────────
export const collectionService = {
  getAll: (token: string) => request<unknown[]>("/collections", {}, token),

  getById: (token: string, id: number) =>
    request<unknown>(`/collections/${id}`, {}, token),

  create: (token: string, data: { name: string; description?: string; isPublic?: boolean }) =>
    request<unknown>("/collections", {
      method: "POST",
      body: JSON.stringify(data),
    }, token),

  update: (token: string, id: number, data: Record<string, unknown>) =>
    request<unknown>(`/collections/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }, token),

  delete: (token: string, id: number) =>
    request<null>(`/collections/${id}`, { method: "DELETE" }, token),

  addItem: (token: string, collectionId: number, designId: number) =>
    request<unknown>(`/collections/${collectionId}/items`, {
      method: "POST",
      body: JSON.stringify({ designId }),
    }, token),

  removeItem: (token: string, collectionId: number, designId: number) =>
    request<null>(
      `/collections/${collectionId}/items?designId=${designId}`,
      { method: "DELETE" },
      token
    ),
};

// ─── AI Services ──────────────────────────────────────────────────────────────
export interface AiGenerateParams {
  prompt: string;
  style?: string;
  roomType?: string;
  colors?: string[];
  budget?: string;
}

export const aiService = {
  generate: (token: string, params: AiGenerateParams) =>
    request<unknown>("/ai/generate", {
      method: "POST",
      body: JSON.stringify(params),
    }, token),

  getHistory: (token: string) =>
    request<unknown[]>("/ai/generate", {}, token),
};

// ─── Dashboard Services ───────────────────────────────────────────────────────
export const dashboardService = {
  getRecentlyViewed: (token: string) =>
    request<unknown[]>("/recently-viewed", {}, token),

  getNotifications: (token: string) =>
    request<unknown[]>("/notifications", {}, token),

  markNotificationsRead: (token: string, notificationId?: number) =>
    request<null>("/notifications", {
      method: "PATCH",
      body: JSON.stringify({ notificationId }),
    }, token),
};
