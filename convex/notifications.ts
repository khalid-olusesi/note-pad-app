import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./betterAuth/auth";
import { ConvexError } from "convex/values";

export const getNotifications = query({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", (user as any)._id))
      .order("desc")
      .collect();

    return notifications;
  },
});

export const getUnreadNotificationsCount = query({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return 0;

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_isRead", (q) =>
        q.eq("userId", (user as any)._id).eq("isRead", false)
      )
      .collect();

    return unreadNotifications.length;
  },
});

export const createNotification = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    type: v.string(),
    relatedNoteId: v.optional(v.id("notes")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    await ctx.db.insert("notifications", {
      userId: (user as any)._id,
      title: args.title,
      message: args.message,
      type: args.type,
      isRead: false,
      createdAt: Date.now(),
      relatedNoteId: args.relatedNoteId,
    });
  },
});

// A mutation that can be called directly from other convex functions (like internal background tasks or other mutations) without requiring the auth ctx check to be repeated if not needed.
// However, since we'll call createNotification from frontend or backend mutations, we can use an internal mutation for internal server calls.
export const internalCreateNotification = internalMutation({
  args: {
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.string(),
    relatedNoteId: v.optional(v.id("notes")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.title,
      message: args.message,
      type: args.type,
      isRead: false,
      createdAt: Date.now(),
      relatedNoteId: args.relatedNoteId,
    });
  },
});

export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });
  },
});

export const markAllAsRead = mutation({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId_isRead", (q) =>
        q.eq("userId", (user as any)._id).eq("isRead", false)
      )
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
      });
    }
  },
});
