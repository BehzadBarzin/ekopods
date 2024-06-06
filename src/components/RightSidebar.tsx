"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useAudio } from "@/providers/AudioProvider";
import { cn } from "@/lib/utils";

const RightSidebar = () => {
  // ---------------------------------------------------------------------------
  // Currently signed in user from Clerk
  const { user } = useUser();
  // ---------------------------------------------------------------------------
  // Get top users by podcast count from Convex
  const topEkopodsters = useQuery(api.users.getTopUserByPodcastCount);
  // ---------------------------------------------------------------------------
  const router = useRouter();
  // ---------------------------------------------------------------------------
  // Get audio from Audio Context
  const { audio } = useAudio();
  // ---------------------------------------------------------------------------
  return (
    <section
      className={cn("right_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Only if user is signed in */}
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h1>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>
      {/* ------------------------------------------------------------------ */}
      {/* Fans Like You */}
      <section>
        <Header headerTitle="Fans Like You" />
        <Carousel fansLikeDetail={topEkopodsters!} />
      </section>
      {/* ------------------------------------------------------------------ */}
      {/* Top Ekopodsters */}
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Ekopodsters" />
        {/* List of top Users */}
        <div className="flex flex-col gap-6">
          {topEkopodsters?.slice(0, 3).map((ekopodster) => (
            <div
              key={ekopodster._id}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/profile/${ekopodster.clerkId}`)}
            >
              {/* User image and name */}
              <figure className="flex items-center gap-2">
                {/* User image */}
                <Image
                  src={ekopodster.imageUrl}
                  alt={ekopodster.name}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                {/* User name */}
                <h2 className="text-14 font-semibold text-white-1">
                  {ekopodster.name}
                </h2>
              </figure>
              {/* User's Podcast count */}
              <div className="flex items-center">
                <p className="text-12 font-normal text-white-1">
                  {ekopodster.totalPodcasts} podcasts
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ------------------------------------------------------------------ */}
    </section>
  );
};

export default RightSidebar;
