import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// -----------------------------------------------------------------------------
// This mutation returns the uploaded audio file's url from the Convex storage
export const getUrl = mutation({
  // Accepted arguments
  args: {
    storageId: v.id("_storage"),
  },
  // Handler function
  handler: async (ctx, args) => {
    // Get the url from the Convex storage by its id
    return await ctx.storage.getUrl(args.storageId);
  },
});

// -----------------------------------------------------------------------------
// Create podcast mutation
export const createPodcast = mutation({
  // Accepted arguments for the mutation
  args: {
    audioStorageId: v.id("_storage"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    views: v.number(),
    audioDuration: v.number(),
  },
  // Handler function called when the mutation is called
  handler: async (ctx, args) => {
    // Check if the user is authenticated
    const identity = await ctx.auth.getUserIdentity();

    // If the user is not authenticated, throw an error
    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    // Get the user from the database by their email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    // If the user is not found, throw an error
    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    // Insert the podcast into the database and return it
    return await ctx.db.insert("podcasts", {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      podcastTitle: args.podcastTitle,
      podcastDescription: args.podcastDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: args.voiceType,
      views: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
    });
  },
});

// -----------------------------------------------------------------------------
