import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// -----------------------------------------------------------------------------
// Define the Convex database schema
export default defineSchema({
  // ---------------------------------------------------------------------------
  // 'podcasts' table:
  podcasts: defineTable({
    user: v.id("users"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.optional(v.string()),
    audioStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.number(),
    views: v.number(),
  })
    // Define search indexes: (https://docs.convex.dev/text-search)
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", { searchField: "podcastTitle" })
    .searchIndex("search_body", { searchField: "podcastDescription" }),
  // ---------------------------------------------------------------------------
  // 'users' table:
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
});

// -----------------------------------------------------------------------------
