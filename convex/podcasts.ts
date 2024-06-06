import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// -----------------------------------------------------------------------------
// Mutations:
// -----------------------------------------------------------------------------
// Mutation: returns the uploaded audio file's url from the Convex storage
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
// Mutation: Create podcast
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
// Mutation: will update the views of the podcast.
export const updatePodcastViews = mutation({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    return await ctx.db.patch(args.podcastId, {
      views: podcast.views + 1,
    });
  },
});

// -----------------------------------------------------------------------------
// Mutation: will delete the podcast.
export const deletePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.podcastId);
  },
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Queries:
// -----------------------------------------------------------------------------
// Query: will get the podcasts based on their view count
export const getTrendingPodcasts = query({
  handler: async (ctx) => {
    // Get the podcast from the database
    const podcast = await ctx.db.query("podcasts").collect();
    // Sort the podcast by view count and return the top 8
    return podcast.sort((a, b) => b.views - a.views).slice(0, 8);
  },
});

// -----------------------------------------------------------------------------
// Query: will get the podcast by the podcastId.
export const getPodcastById = query({
  // Accepted arguments
  args: {
    podcastId: v.id("podcasts"),
  },
  // Handler function
  handler: async (ctx, args) => {
    return await ctx.db.get(args.podcastId);
  },
});

// -----------------------------------------------------------------------------
// Query: will get all the podcasts.
export const getAllPodcasts = query({
  handler: async (ctx) => {
    return await ctx.db.query("podcasts").order("desc").collect();
  },
});

// -----------------------------------------------------------------------------
// Query: will get all the podcasts based on the voiceType of the podcast
export const getPodcastByVoiceType = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    return await ctx.db
      .query("podcasts")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), podcast?.voiceType),
          q.neq(q.field("_id"), args.podcastId)
        )
      )
      .collect();
  },
});

// -----------------------------------------------------------------------------
// Query: will get the podcast by the authorId.
export const getPodcastByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = podcasts.reduce(
      (sum, podcast) => sum + podcast.views,
      0
    );

    return { podcasts, listeners: totalListeners };
  },
});

// -----------------------------------------------------------------------------
// Query: will get the podcast by the search query.
export const getPodcastBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("podcasts").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_title", (q) =>
        q.search("podcastTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("podcasts")
      .withSearchIndex("search_body", (q) =>
        q.search("podcastDescription" || "podcastTitle", args.search)
      )
      .take(10);
  },
});

// -----------------------------------------------------------------------------
