// -----------------------------------------------------------------------------
/**
 * Read this to learn about integrating Convex with Clerk:
 * Step 4 of the guide below.
 *
 * https://docs.convex.dev/auth/clerk
 */
// -----------------------------------------------------------------------------
const authConfig = {
  providers: [
    {
      domain: "https://popular-jackal-60.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

export default authConfig;
