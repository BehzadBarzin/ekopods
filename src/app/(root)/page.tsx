"use client";

import PodcastCard from "@/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const Home = () => {
  // ---------------------------------------------------------------------------
  const trending = useQuery(api.podcasts.getTrendingPodcasts);
  // ---------------------------------------------------------------------------
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        <div className="podcast_grid">
          {trending?.map((pd) => {
            return (
              <PodcastCard
                key={pd._id}
                podcastId={pd._id}
                imgUrl={pd.imageUrl ?? ""}
                title={pd.podcastTitle}
                description={pd.podcastDescription}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
