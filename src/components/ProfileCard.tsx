"use client";
import { Id } from "@/../convex/_generated/dataModel";
import Image from "next/image";
import { useEffect, useState, FC } from "react";
import { useAudio } from "@/providers/AudioProvider";
import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";

// -----------------------------------------------------------------------------
// Types
interface PodcastProps {
  _id: Id<"podcasts">;
  _creationTime: number;
  audioStorageId: Id<"_storage"> | null;
  user: Id<"users">;
  podcastTitle: string;
  podcastDescription: string;
  audioUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voicePrompt: string;
  imagePrompt: string | null;
  voiceType: string;
  audioDuration: number;
  views: number;
}

interface ProfilePodcastProps {
  podcasts: PodcastProps[];
  listeners: number;
}

interface IProps {
  podcastData: ProfilePodcastProps;
  imageUrl: string;
  userFirstName: string;
}

// -----------------------------------------------------------------------------
const ProfileCard: FC<IProps> = ({ podcastData, imageUrl, userFirstName }) => {
  // ---------------------------------------------------------------------------
  // Get the currently playing audio setter from the Audio Context
  const { setAudio } = useAudio();
  // ---------------------------------------------------------------------------
  // Random podcast
  const [randomPodcast, setRandomPodcast] = useState<PodcastProps | null>(null);
  // ---------------------------------------------------------------------------
  // User selects "Play Random Podcast"
  const playRandomPodcast = () => {
    // Randomly select a podcast
    const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length);
    setRandomPodcast(podcastData.podcasts[randomIndex]);
  };
  // ---------------------------------------------------------------------------
  // If there is a random podcast, set it as the currently playing audio
  useEffect(() => {
    if (randomPodcast) {
      setAudio({
        title: randomPodcast.podcastTitle,
        audioUrl: randomPodcast.audioUrl || "",
        imageUrl: randomPodcast.imageUrl || "",
        author: randomPodcast.author,
        podcastId: randomPodcast._id,
      });
    }
  }, [randomPodcast, setAudio]);

  // ---------------------------------------------------------------------------
  // If no image, we're still loading. Display loader.
  if (!imageUrl) return <LoaderSpinner />;
  // ---------------------------------------------------------------------------
  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
      {/* ------------------------------------------------------------------ */}
      {/* Image */}
      <Image
        src={imageUrl}
        width={250}
        height={250}
        alt="Ekopodster"
        className="aspect-square rounded-lg"
      />
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          {/* -------------------------------------------------------------- */}
          {/* Verified */}
          <figure className="flex gap-2 max-md:justify-center">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-white-2">
              Verified Creator
            </h2>
          </figure>
          {/* -------------------------------------------------------------- */}
          {/* Name */}
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
            {userFirstName}
          </h1>
          {/* -------------------------------------------------------------- */}
        </div>
        {/* ---------------------------------------------------------------- */}
        {/* Listeners */}
        <figure className="flex gap-3 py-6">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphones"
          />
          <h2 className="text-16 font-semibold text-white-1">
            {podcastData?.listeners} &nbsp;
            <span className="font-normal text-white-2">monthly listeners</span>
          </h2>
        </figure>
        {/* ---------------------------------------------------------------- */}
        {/* Play random podcast */}
        {podcastData?.podcasts.length > 0 && (
          <Button
            onClick={playRandomPodcast}
            className="text-16 bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play a random podcast
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
