"use client";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import { Id } from "@/../convex/_generated/dataModel";
import { api } from "@/../convex/_generated/api";
import { useAudio } from "@/providers/AudioProvider";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface IProps {
  audioUrl: string;
  podcastTitle: string;
  author: string;
  isOwner: boolean;
  imageUrl: string;
  podcastId: Id<"podcasts">;
  imageStorageId: Id<"_storage">;
  audioStorageId: Id<"_storage">;
  authorImageUrl: string;
  authorId: string;
}

const PodcastDetailPlayer: FC<IProps> = ({
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  podcastId,
  imageStorageId,
  audioStorageId,
  isOwner,
  authorImageUrl,
  authorId,
}) => {
  // ---------------------------------------------------------------------------
  const router = useRouter();
  // ---------------------------------------------------------------------------
  // Retrieve the Audio Context, then get the setAudio function to set the currently playing audio
  const { setAudio } = useAudio();
  // ---------------------------------------------------------------------------
  // To display messages
  const { toast } = useToast();
  // ---------------------------------------------------------------------------
  const [isDeleting, setIsDeleting] = useState(false);
  // Get the Convex mutation
  const deletePodcast = useMutation(api.podcasts.deletePodcast);
  // ---------------------------------------------------------------------------
  // Handle deleting the podcast
  const handleDelete = async () => {
    try {
      // -----------------------------------------------------------------------
      // Invoke the Convex mutation to delete the podcast
      await deletePodcast({ podcastId, imageStorageId, audioStorageId });
      // -----------------------------------------------------------------------
      // Show a toast
      toast({
        title: "Podcast deleted",
      });
      // Navigate to the home page
      router.push("/");
      // -----------------------------------------------------------------------
    } catch (error) {
      // -----------------------------------------------------------------------
      console.error("Error deleting podcast", error);
      toast({
        title: "Error deleting podcast",
        variant: "destructive",
      });
      // -----------------------------------------------------------------------
    }
  };
  // ---------------------------------------------------------------------------
  // Handle playing the podcast
  const handlePlay = () => {
    // Set the currently playing audio in the Audio Context
    setAudio({
      title: podcastTitle,
      audioUrl,
      imageUrl,
      author,
      podcastId,
    });
  };

  // ---------------------------------------------------------------------------
  // If there is no image or author image, it means that we're loading
  if (!imageUrl || !authorImageUrl) return <LoaderSpinner />;
  // ---------------------------------------------------------------------------
  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      {/* ------------------------------------------------------------------ */}
      {/* Podcast Details: */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        {/* Podcast Thumbnail */}
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            {/* Podcast Title */}
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {podcastTitle}
            </h1>
            {/* Podcast Author */}
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                router.push(`/profile/${authorId}`);
              }}
            >
              <Image
                src={authorImageUrl}
                width={30}
                height={30}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </article>
          {/* Play Button */}
          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play podcast
          </Button>
        </div>
      </div>
      {/* ------------------------------------------------------------------ */}
      {/* Podcast Modification (If Owner): */}
      {/* ------------------------------------------------------------------ */}
      {isOwner && (
        <div className="relative mt-2">
          <Image
            src="/icons/three-dots.svg"
            width={20}
            height={30}
            alt="Three dots icon"
            className="cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          />
          {isDeleting && (
            <div
              className="absolute -left-32 -top-2 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2"
              onClick={handleDelete}
            >
              <Image
                src="/icons/delete.svg"
                width={16}
                height={16}
                alt="Delete icon"
              />
              <h2 className="text-16 font-normal text-white-1">Delete</h2>
            </div>
          )}
        </div>
      )}
      {/* ------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------ */}
    </div>
  );
};

export default PodcastDetailPlayer;
