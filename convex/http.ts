// -----------------------------------------------------------------------------
/**
 * This file is the entry point for the Convex HTTP webhook endpoint:
 *
 * To learn about this webhook file take a look at Convex Template for Clerk:
 *
 * Convex Templates: https://www.convex.dev/templates
 *
 * Clerk Template: https://www.convex.dev/templates/clerk
 * GitHub Repo for Clerk Template: https://github.com/thomasballinger/convex-clerk-users-table
 */
// -----------------------------------------------------------------------------
import type { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

// Webhook handler for clerk auth
const handleClerkWebhook = httpAction(async (ctx, request) => {
  // ---------------------------------------------------------------------------
  // Validate the request to make sure it's coming from Clerk
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Invalid request", { status: 400 });
  }
  // ---------------------------------------------------------------------------
  // Handle the event based on the type
  switch (event.type) {
    // -------------------------------------------------------------------------
    // When a user is created
    case "user.created":
      // Insert user into convex database
      await ctx.runMutation(internal.users.createUser, {
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
        imageUrl: event.data.image_url,
        name: event.data.first_name!,
      });
      break;
    // -------------------------------------------------------------------------
    // When a user is updated
    case "user.updated":
      // Update user in convex database
      await ctx.runMutation(internal.users.updateUser, {
        clerkId: event.data.id,
        imageUrl: event.data.image_url,
        email: event.data.email_addresses[0].email_address,
      });
      break;
    // -------------------------------------------------------------------------
    // When a user is deleted
    case "user.deleted":
      // Delete user from convex database
      await ctx.runMutation(internal.users.deleteUser, {
        clerkId: event.data.id as string,
      });
      break;
    // -------------------------------------------------------------------------
  }
  // Return success response back to Clerk
  // Remember this webhook is being triggered by Clerk
  return new Response(null, {
    status: 200,
  });
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Create a new Convex HTTP router
const http = httpRouter();

// Register the webhook route for Clerk callback
http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Helper function to validate the request to make sure it's coming from Clerk
const validateRequest = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not defined");
  }
  const payloadString = await req.text();
  const headerPayload = req.headers;
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  const event = wh.verify(payloadString, svixHeaders);
  return event as unknown as WebhookEvent;
};

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

// Export the HTTP router
export default http;

// -----------------------------------------------------------------------------
