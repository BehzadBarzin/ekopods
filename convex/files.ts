import { mutation } from "./_generated/server";

/**
 * Using UploadStuff to handle file uploads to Convex.
 *
 * To learn about its use, take a look at:
 * https://uploadstuff.dev/getting-started/server-setup
 */

// -----------------------------------------------------------------------------
// Define a mutation in this Convex app's public API.
export const generateUploadUrl = mutation({
  // Accepted arguments
  args: {},
  // Handler function
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});
