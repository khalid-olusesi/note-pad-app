import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { tables as authTables } from "./betterAuth/schema";

export default defineSchema({
  ...authTables,
  notes: defineTable({
    title: v.string(),
    body: v.string(),
    coverImage: v.optional(v.string()),
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    isTrashed: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
    deletedAt: v.optional(v.number()),
    isFavorite: v.optional(v.boolean()),
    reminderEnabled: v.optional(v.boolean()),
    reminderTime: v.optional(v.number()),
    tag: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .searchIndex("search_title", {
      searchField: "title",
    })
    .searchIndex("search_body", {
      searchField: "body",
    }),

  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.string(), // reminder, activity, system
    isRead: v.boolean(),
    createdAt: v.number(),
    relatedNoteId: v.optional(v.id("notes")),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_isRead", ["userId", "isRead"]),

  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.number(),
  }).index("by_userId_createdAt", ["userId", "createdAt"]),

  messages: defineTable({
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    sources: v.optional(
      v.array(
        v.object({
          noteId: v.id("notes"),
          title: v.string(),
          excerpt: v.string(),
        }),
      ),
    ),
    createdAt: v.number(),
  }).index("by_chatId_createdAt", ["chatId", "createdAt"]),

  supportMessages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    priority: v.optional(v.string()), // low, medium, high, critical
    type: v.optional(v.string()), // contact, bug, feature
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
