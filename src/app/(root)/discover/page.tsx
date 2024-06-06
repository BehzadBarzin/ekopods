"use client";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import SearchBar from "@/components/SearchBar";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import React, { FC } from "react";

interface IProps {
  searchParams: { search: string };
}

const Discover: FC<IProps> = ({ searchParams: { search } }) => {
  // ---------------------------------------------------------------------------
  // Use Convex Query to search podcasts
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, {
    search: search || "",
  });
  // ---------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-9">
      <SearchBar />
      <div className="flex flex-col gap-9">
        {/* ---------------------------------------------------------------- */}
        {/* Heading */}
        {/* ---------------------------------------------------------------- */}
        <h1 className="text-20 font-bold text-white-1">
          {/* Title based on search */}
          {!search ? "Discover Trending Podcasts" : "Search results for: "}
          {/* Search term */}
          {search && <span className="text-white-2 font-light">{search}</span>}
        </h1>
        {/* ---------------------------------------------------------------- */}
        {/* Podcasts Grid */}
        {/* ---------------------------------------------------------------- */}
        {podcastsData ? (
          // If there are podcast data:
          <>
            {podcastsData.length > 0 ? (
              // If the podcast data is not empty, we'll display the podcast grid:
              <div className="podcast_grid">
                {podcastsData?.map(
                  ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                    <PodcastCard
                      key={_id}
                      imgUrl={imageUrl!}
                      title={podcastTitle}
                      description={podcastDescription}
                      podcastId={_id}
                    />
                  )
                )}
              </div>
            ) : (
              // If the podcasts data is empty, we'll display an empty state:
              <EmptyState title="No results found" />
            )}
          </>
        ) : (
          // If there is no podcast data, we're loading:
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default Discover;
