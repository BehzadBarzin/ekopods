import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Id } from "@/../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IProps {
  voiceType: string;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}

// =============================================================================
// Custom Hook to handle the logic
const useGeneratePodcast = (args: IProps) => {
  // Todo: Implement this

  return {
    isGenerating: false,
    generatePodcast: () => {},
  };
};

// =============================================================================

const GeneratePodcast: FC<IProps> = (props) => {
  // ---------------------------------------------------------------------------
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  // ---------------------------------------------------------------------------
  return (
    <div>
      {/* ------------------------------------------------------------------ */}
      {/* Voice Prompt */}
      <div className="flex flex-col gap-2.5 ">
        {/* Label */}
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate podcast audio
        </Label>
        {/* Prompt Textarea */}
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Prompt the AI to generate the podcast audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      {/* ------------------------------------------------------------------ */}
      {/* Button */}
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 font-bold bg-orange-1 text-white-1 py-4 transition-all duration-500 hover:bg-orange-900"
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {/* ------------------------------------------------------------------ */}
      {/* If audio is generated, auto play it */}
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
      {/* ------------------------------------------------------------------ */}
    </div>
  );
};

export default GeneratePodcast;
