import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./betterAuth/auth";
import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const createNote = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    coverImage: v.optional(v.string()),
    isTrashed: v.optional(v.boolean()),
    isFavorite: v.optional(v.boolean()),
    reminderEnabled: v.optional(v.boolean()),
    reminderTime: v.optional(v.number()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      body: args.body,
      userId: (user as any)._id,
      coverImage: args.coverImage,
      createdAt: Date.now(),
      isTrashed: args.isTrashed ?? false,
      isFavorite: args.isFavorite ?? false,
      reminderEnabled: args.reminderEnabled ?? false,
      reminderTime: args.reminderTime,
      tag: args.tag || "Ideas",
    });

    await ctx.runMutation(internal.notifications.internalCreateNotification, {
      userId: (user as any)._id,
      title: "Note Created",
      message: `You created a new note: "${args.title}"`,
      type: "activity",
      relatedNoteId: noteId,
    });

    return noteId;
  },
});

// Return the last 100 tasks in a given task list.

export const getNotesList = query({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) return [];

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", (user as any)._id))
      .order("desc")
      .collect();

    return notes.filter((n) => n.isTrashed !== true);
  },
});

export const getNote = query({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) return null;

    const note = await ctx.db.get(args.noteId);

    if (!note || note.userId !== (user as any)._id) {
      return null;
    }

    return note;
  },
});

export const getTrashedNotes = query({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) return [];

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", (user as any)._id))
      .order("desc")
      .collect();

    return notes.filter((n) => n.isTrashed === true);
  },
});

export const restoreNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    const note = await ctx.db.get(args.noteId);

    await ctx.db.patch(args.noteId, {
      isTrashed: false,
    });

    if (user && note) {
      await ctx.runMutation(internal.notifications.internalCreateNotification, {
        userId: (user as any)._id,
        title: "Note Restored",
        message: `You restored the note: "${note.title}"`,
        type: "activity",
        relatedNoteId: note._id,
      });
    }
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.noteId);
  },
});

export const moveToTrash = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    const note = await ctx.db.get(args.noteId);

    await ctx.db.patch(args.noteId, {
      isTrashed: true,
      isDeleted: true,
      deletedAt: Date.now(),
    });

    if (user && note) {
      await ctx.runMutation(internal.notifications.internalCreateNotification, {
        userId: (user as any)._id,
        title: "Note Trashed",
        message: `You moved the note "${note.title}" to trash.`,
        type: "activity",
        relatedNoteId: note._id,
      });
    }
  },
});

export const toggleFavorite = mutation({
  args: {
    noteId: v.id("notes"),
  },

  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new ConvexError("Note not found");
    }

    await ctx.db.patch(args.noteId, {
      isFavorite: !note.isFavorite, // for note toggle
    });
  },
});

export const getFavoriteNotes = query({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      return [];
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", (user as any)._id))
      .order("desc")
      .collect();
    return notes.filter((n) => n.isFavorite && !n.isTrashed);
  },
});

export const deleteAllTrashedNotes = mutation({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", (user as any)._id))
      .collect();

    const trashedNotes = notes.filter((n) => n.isTrashed === true);

    for (const note of trashedNotes) {
      await ctx.db.delete(note._id);
    }
  },
});

export const duplicateNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const original = await ctx.db.get(args.noteId);
    if (!original || original.userId !== (user as any)._id) {
      throw new ConvexError("Note not found");
    }

    const noteId = await ctx.db.insert("notes", {
      title: `${original.title} (Copy)`,
      body: original.body,
      userId: (user as any)._id,
      coverImage: original.coverImage,
      createdAt: Date.now(),
      isTrashed: false,
      isFavorite: false,
      reminderEnabled: false,
      reminderTime: undefined,
      tag: original.tag || "Ideas",
    });

    return noteId;
  },
});

export const changeTag = mutation({
  args: {
    noteId: v.id("notes"),
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.noteId, {
      tag: args.tag,
      updatedAt: Date.now(),
    });
  },
});

export const updateNotes = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.string(),
    body: v.string(),
    coverImage: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    tag: v.optional(v.string()),
    reminderEnabled: v.optional(v.boolean()),
    reminderTime: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const { noteId, ...fields } = args;
    await ctx.db.patch(noteId, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const searchNotes = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const results: Array<Doc<"notes">> = [];
    const seen = new Set();

    const pushDocs = async (docs: Array<Doc<"notes">>) => {
      for (const doc of docs) {
        if (doc.userId !== user._id) continue;
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        if (doc.isTrashed) continue;
        results.push(doc);

        if (results.length >= args.limit) break;
      }
    };

    const titleMatches = await ctx.db
      .query("notes")
      .withSearchIndex("search_title", (q) => q.search("title", args.term))
      .take(args.limit);

    await pushDocs(titleMatches);

    if (results.length < args.limit) {
      const bodyMatches = await ctx.db
        .query("notes")
        .withSearchIndex("search_body", (q) => q.search("body", args.term))
        .take(args.limit);
      await pushDocs(bodyMatches);
    }

    return results;
  },
});

export const cleanupTrash = internalMutation({
  handler: async (ctx) => {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const oldNotes = await ctx.db
      .query("notes")
      .filter((q) =>
        q.and(
          q.eq(q.field("isDeleted"), true),
          q.lt(q.field("deletedAt"), now - thirtyDays),
        ),
      )
      .collect();

    for (const note of oldNotes) {
      await ctx.db.delete(note._id);
    }
  },
});

export const createChat = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // gets details about the current authenticated user
    if (!identity) {
      throw new Error("Not authenticated"); // so here if its not the eprson return error
    }

    const chatId = await ctx.db.insert("chats", {
      userId: identity.subject, //user identity
      title: args.title,
      createdAt: Date.now(),
    });

    return chatId;
  },
});

export const getChats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("chats")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

const messageSourceValidator = v.object({
  noteId: v.id("notes"),
  title: v.string(),
  excerpt: v.string(),
});

export const createMessage = mutation({
  args: {
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    sources: v.optional(v.array(messageSourceValidator)),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: args.role,
      content: args.content,
      sources: args.sources,
      createdAt: Date.now(),
    });
  },
});

export const getMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chatId_createdAt", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

export const delAichat = mutation({
  args: {
    noteId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.noteId);

    if (!chat) {
      throw new Error("Chat not found");
    }
    await ctx.db.delete(args.noteId);
  },
});

export const getAiChat = query({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) return [];

    const delChat = await ctx.db
      .query("chats")
      .withIndex("by_userId_createdAt", (q) =>
        q.eq("userId", (user as any)._id),
      )
      .order("desc")
      .collect();

    return delChat;
  },
});
