"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { formatTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";

import { Progress } from "@/components/ui/progress";

const PodcastPlayer = () => {
  // ---------------------------------------------------------------------------
  // Get currently playing audio from Audio Context
  const { audio } = useAudio();
  // ---------------------------------------------------------------------------
  // Reference to the audio HTML element
  const audioRef = useRef<HTMLAudioElement>(null);
  // ---------------------------------------------------------------------------
  // Is it playing?
  const [isPlaying, setIsPlaying] = useState(false);
  // ---------------------------------------------------------------------------
  // Is it muted?
  const [isMuted, setIsMuted] = useState(false);
  // ---------------------------------------------------------------------------
  // Audio Duration
  const [duration, setDuration] = useState(0);
  // ---------------------------------------------------------------------------
  // Current time
  const [currentTime, setCurrentTime] = useState(0);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };
  // ---------------------------------------------------------------------------
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Forward audio by +5 seconds
  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime &&
      audioRef.current.duration &&
      audioRef.current.currentTime + 5 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  };
  // ---------------------------------------------------------------------------
  // Rewind audio by -5 seconds
  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // On first render, update the current time
  useEffect(() => {
    // callback to be called on timeupdate of the audio HTML element
    const updateCurrentTime = () => {
      // if the audio element is not null
      if (audioRef.current) {
        // update the current time state
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    // if the audio element is not null, add a listener to the timeupdate event
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);

      // Cleanup
      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, []);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Every time the currently playing audio changes in the Audio Context
  useEffect(() => {
    // Handle audio HTML element
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      if (audioElement) {
        audioElement.play().then(() => {
          setIsPlaying(true);
        });
      }
    } else {
      audioElement?.pause();
      setIsPlaying(true);
    }
  }, [audio]);

  // ---------------------------------------------------------------------------
  // Helpers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  // ---------------------------------------------------------------------------
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return (
    <div
      className={cn("sticky bottom-0 left-0 flex size-full flex-col", {
        hidden: !audio?.audioUrl || audio?.audioUrl === "",
      })}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Progress bar */}
      {/* ------------------------------------------------------------------ */}
      {/* change the color for indicator inside the Progress component in ui folder */}
      <Progress
        value={(currentTime / duration) * 100}
        className="w-full"
        max={duration}
      />
      {/* ------------------------------------------------------------------ */}
      <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
        {/* ---------------------------------------------------------------- */}
        {/* Audio Player */}
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        {/* ---------------------------------------------------------------- */}
        {/* Podcast Thumbnail  */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex items-center gap-4 max-md:hidden">
          {/* Link to podcast details page */}
          <Link href={`/podcast/${audio?.podcastId}`}>
            {/* Podcast thumbnail image */}
            <Image
              src={audio?.imageUrl! || "/images/player1.png"}
              width={64}
              height={64}
              alt="player1"
              className="aspect-square rounded-xl"
            />
          </Link>
          {/* -------------------------------------------------------------- */}
          {/* Podcast Title */}
          <div className="flex w-[160px] flex-col">
            <h2 className="text-14 truncate font-semibold text-white-1">
              {audio?.title}
            </h2>
            <p className="text-12 font-normal text-white-2">{audio?.author}</p>
          </div>
          {/* -------------------------------------------------------------- */}
        </div>
        {/* ---------------------------------------------------------------- */}
        {/* Player Controls */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex-center cursor-pointer gap-3 md:gap-6">
          {/* Rewind */}
          <div className="flex items-center gap-1.5">
            <Image
              src={"/icons/reverse.svg"}
              width={24}
              height={24}
              alt="rewind"
              onClick={rewind}
            />
            <h2 className="text-12 font-bold text-white-4">-5</h2>
          </div>
          {/* Play/Pause */}
          <Image
            src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
            width={30}
            height={30}
            alt="play"
            onClick={togglePlayPause}
          />
          {/* Forward */}
          <div className="flex items-center gap-1.5">
            <h2 className="text-12 font-bold text-white-4">+5</h2>
            <Image
              src={"/icons/forward.svg"}
              width={24}
              height={24}
              alt="forward"
              onClick={forward}
            />
          </div>
        </div>
        {/* ---------------------------------------------------------------- */}
        {/* Duration and Mute button */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex items-center gap-6">
          {/* Duration */}
          <h2 className="text-16 font-normal text-white-2 max-md:hidden">
            {formatTime(duration)}
          </h2>
          {/* Mute button */}
          <div className="flex w-full gap-2">
            <Image
              src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
              width={24}
              height={24}
              alt="mute unmute"
              onClick={toggleMute}
              className="cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
