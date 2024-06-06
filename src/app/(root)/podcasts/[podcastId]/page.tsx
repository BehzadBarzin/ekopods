"use client";
import React, { FC } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import EmptyState from "@/components/EmptyState";

interface IProps {
  params: {
    podcastId: string;
  };
}

const PodcastDetails: FC<IProps> = ({ params }) => {
  // ---------------------------------------------------------------------------
  const podcast = useQuery(api.podcasts.getPodcastById, {
    podcastId: params.podcastId as Id<"podcasts">,
  });
  // ---------------------------------------------------------------------------
  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId: params.podcastId as Id<"podcasts">,
  });
  // ---------------------------------------------------------------------------
  // If there is no podcast, or similar podcasts, it means that we're loading
  if (!podcast || !similarPodcasts) {
    return <LoaderSpinner />;
  }
  // ---------------------------------------------------------------------------
  return (
    <section className="flex w-full flex-col">
      {/* ------------------------------------------------------------------ */}
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
      </header>
      {/* ------------------------------------------------------------------ */}
      <figure className="flex gap-3">
        {/* Headphone Icon */}
        <Image
          src="/icons/headphone.svg"
          width={24}
          height={24}
          alt="headphone icon"
        />
        {/* View Count */}
        <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
      </figure>
      {/* ------------------------------------------------------------------ */}
      {/* Detail Player */}
      <PodcastDetailPlayer />
      {/* ------------------------------------------------------------------ */}
      {/* Description */}
      <p className="text-16 text-white-2 pb-8 pt-[45px] font-medium md:text-center">
        {podcast?.podcastDescription}
      </p>
      {/* ------------------------------------------------------------------ */}
      {/* Transcription (AI prompt used to generate audio) */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-18 font-bold text-white-1">Transcription</h1>
          <p className="text-16 font-medium text-white-2">
            {podcast?.voicePrompt}
          </p>
        </div>
      </div>
      {/* ------------------------------------------------------------------ */}
      {/* Thumbnail Prompt (AI prompt used to generate image) */}
      {podcast?.imagePrompt && (
        <div className="flex flex-col gap-8 mt-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
            <p className="text-16 font-medium text-white-2">
              {podcast?.imagePrompt}
            </p>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------------ */}
      {/* Similar Podcasts */}
      <section className="mt-8 flex flex-col gap-5">
        {/* Similar Podcasts Header */}
        {/* ---------------------------------------------------------------- */}
        <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>
        {/* Similar Podcasts Grid */}
        {similarPodcasts && similarPodcasts.length > 0 ? (
          // If there are similar podcasts:
          <div className="podcast_grid">
            {similarPodcasts?.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl as string}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          // If there are no similar podcasts:
          <>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )}
      </section>
      {/* ------------------------------------------------------------------ */}
    </section>
  );
};

export default PodcastDetails;
