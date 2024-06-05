"use client";

import { FC, ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

// -----------------------------------------------------------------------------
/**
 * Read this to learn about integrating Convex with Clerk:
 * Step 8 of the guide below.
 *
 * https://docs.convex.dev/auth/clerk
 */
// -----------------------------------------------------------------------------
// Setup Convex Client
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

// -----------------------------------------------------------------------------

interface IProps {
  children: ReactNode;
}

const ConvexClerkProvider: FC<IProps> = ({ children }) => (
  // Clerk Provider
  <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    appearance={{
      layout: {
        socialButtonsVariant: "auto",
        logoImageUrl: "/icons/logo-auth.png",
        shimmer: true,
      },
      variables: {
        colorBackground: "#15171c",
        colorPrimary: "",
        colorText: "white",
        colorInputBackground: "#1b1f29",
        colorInputText: "white",
      },
    }}
  >
    {/* Convex Provider (With Clerk) */}
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>
);

export default ConvexClerkProvider;
