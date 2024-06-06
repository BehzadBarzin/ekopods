"use client";
import { useQuery } from "convex/react";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/../convex/_generated/api";
import { FC } from "react";

interface IProps {
  params: {
    profileId: string;
  };
}

const ProfilePage: FC<IProps> = ({ params }) => {
  // ---------------------------------------------------------------------------
  // Use Convex Query to get user by clerkId
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });
  // ---------------------------------------------------------------------------
  // Use Convex Query to get all the podcast by authorId
  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: params.profileId,
  });
  // ---------------------------------------------------------------------------
  // If data is null, we're still loading. Display the loader.
  if (!user || !podcastsData) return <LoaderSpinner />;
  // ---------------------------------------------------------------------------
  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Ekopodster Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          // If there are podcasts, display them:
          <div className="podcast_grid">
            {podcastsData?.podcasts
              ?.slice(0, 4)
              .map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  imgUrl={podcast.imageUrl!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  podcastId={podcast._id}
                />
              ))}
          </div>
        ) : (
          // If there are no podcasts, display an empty state:
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
