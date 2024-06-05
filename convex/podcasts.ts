import { v } from "convex/values";

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
