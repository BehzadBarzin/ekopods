"use client";
import { usePathname } from "next/navigation";
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// -----------------------------------------------------------------------------
// Types

// Audio Context Provider Props
interface IProps {
  children: React.ReactNode;
}

// Type of the Context
interface IAudioContextType {
  // Currently playing audio
  audio: IAudioProps | undefined;
  // Set the currently playing audio
  setAudio: React.Dispatch<React.SetStateAction<IAudioProps | undefined>>;
}

// Audio Type in the Context
interface IAudioProps {
  title: string;
  audioUrl: string;
  author: string;
  imageUrl: string;
  podcastId: string;
}

// -----------------------------------------------------------------------------
// Define Audio Context
const AudioContext = createContext<IAudioContextType | undefined>(undefined);

// -----------------------------------------------------------------------------
// Audio Context Provider
const AudioProvider: FC<IProps> = ({ children }) => {
  // ---------------------------------------------------------------------------
  const [audio, setAudio] = useState<IAudioProps | undefined>();
  // ---------------------------------------------------------------------------
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/create-podcast") setAudio(undefined);
  }, [pathname]);
  // ---------------------------------------------------------------------------
  return (
    <AudioContext.Provider value={{ audio, setAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

// -----------------------------------------------------------------------------

// Custom hook to use/return the Audio Context
export const useAudio = () => {
  const context = useContext(AudioContext);

  if (!context)
    throw new Error("useAudio must be used within an AudioProvider");

  return context;
};

// -----------------------------------------------------------------------------

export default AudioProvider;
