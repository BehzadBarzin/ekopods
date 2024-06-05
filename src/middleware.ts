import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// -----------------------------------------------------------------------------
// Function to check if a route should be public
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

// -----------------------------------------------------------------------------
// A middleware to determine the routes to protect
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});

// -----------------------------------------------------------------------------
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
