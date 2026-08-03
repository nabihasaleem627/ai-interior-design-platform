import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  json,
  serial,
} from "drizzle-orm/pg-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  preferredStyles: json("preferred_styles").$type<string[]>().default([]),
  preferredRooms: json("preferred_rooms").$type<string[]>().default([]),
  budgetPreference: varchar("budget_preference", { length: 50 }).default("medium"),
  theme: varchar("theme", { length: 20 }).default("light"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Designs ──────────────────────────────────────────────────────────────────
export const designs = pgTable("designs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  roomType: varchar("room_type", { length: 100 }).notNull(),
  style: varchar("style", { length: 100 }).notNull(),
  images: json("images").$type<string[]>().notNull().default([]),
  colorPalette: json("color_palette").$type<string[]>().notNull().default([]),
  furniture: json("furniture").$type<string[]>().notNull().default([]),
  materials: json("materials").$type<string[]>().notNull().default([]),
  budgetCategory: varchar("budget_category", { length: 50 }).notNull(),
  estimatedBudget: decimal("estimated_budget", { precision: 10, scale: 2 }),
  designerName: varchar("designer_name", { length: 255 }),
  designerNotes: text("designer_notes"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  tags: json("tags").$type<string[]>().default([]),
  isAiGenerated: boolean("is_ai_generated").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Favorites ────────────────────────────────────────────────────────────────
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  designId: integer("design_id")
    .notNull()
    .references(() => designs.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Collections ─────────────────────────────────────────────────────────────
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  isPublic: boolean("is_public").default(false),
  shareToken: varchar("share_token", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Collection Items ─────────────────────────────────────────────────────────
export const collectionItems = pgTable("collection_items", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
  designId: integer("design_id")
    .notNull()
    .references(() => designs.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// ─── AI Recommendations ───────────────────────────────────────────────────────
export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  style: varchar("style", { length: 100 }),
  roomType: varchar("room_type", { length: 100 }),
  colors: json("colors").$type<string[]>().default([]),
  budget: varchar("budget", { length: 50 }),
  result: json("result").$type<Record<string, unknown>>(),
  savedDesignIds: json("saved_design_ids").$type<number[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Recently Viewed ─────────────────────────────────────────────────────────
export const recentlyViewed = pgTable("recently_viewed", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  designId: integer("design_id")
    .notNull()
    .references(() => designs.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Type exports ─────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Design = typeof designs.$inferSelect;
export type NewDesign = typeof designs.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type CollectionItem = typeof collectionItems.$inferSelect;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type RecentlyViewed = typeof recentlyViewed.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
