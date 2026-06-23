import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    priority: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("supportMessages", {
      name: args.name,
      email: args.email,
      subject: args.subject,
      message: args.message,
      priority: args.priority,
      type: args.type,
      createdAt: Date.now(),
    });
    return messageId;
  },
});

export const getMessages = query({
  handler: async (ctx) => {
    // You could also add authentication here so only admins can read it
    // For now, we'll just return all messages
    const messages = await ctx.db
      .query("supportMessages")
      .order("desc") // newest first
      .collect();
    
    return messages;
  },
});
