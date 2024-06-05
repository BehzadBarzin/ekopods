import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Id } from "@/../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { v4 as uuidv4 } from "uuid";

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
  // -------------------------------------------------------------------------
  const [isGenerating, setIsGenerating] = useState(false);
  // -------------------------------------------------------------------------
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  // -------------------------------------------------------------------------

  const generatePodcast = async () => {
    setIsGenerating(true);
    // -------------------------------------------------------------------------
    // Rest previous generated audio
    args.setAudio("");
    // -------------------------------------------------------------------------
    // If no prompt, return
    if (!args.voicePrompt) {
      // Todo: Show error message
      setIsGenerating(false);
      return;
    }
    // -------------------------------------------------------------------------
    try {
      // -----------------------------------------------------------------------
      const response = await getPodcastAudio({
        voice: args.voiceType,
        input: args.voicePrompt,
      });
      // Convert the audio to a Blob
      const blob = new Blob([response], { type: "audio/mpeg" });
      // Generate a random file name
      const fileName = `podcast-${uuidv4()}.mp3`;
      // Convert the Blob to a File object
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      // -----------------------------------------------------------------------
    } catch (error) {
      // -----------------------------------------------------------------------
      // Todo: Show error message
      console.error("Error occurred while generating podcast: ", error);
      // -----------------------------------------------------------------------
      setIsGenerating(false);
      return;
    }
    // -------------------------------------------------------------------------
  };

  return {
    isGenerating,
    generatePodcast,
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
