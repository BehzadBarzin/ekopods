import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "@/../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";

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
  // To display messages
  const { toast } = useToast();
  // -------------------------------------------------------------------------
  const [isGenerating, setIsGenerating] = useState(false);
  // -------------------------------------------------------------------------
  // Get the OpenAI Action from the Convex API
  const getPodcastAudio = useAction(api.ai.generateAudioAction);
  // -------------------------------------------------------------------------
  // Integrate Convex mutation and UploadStuff
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  // -------------------------------------------------------------------------
  // Get the Convex mutation that returns the uploaded file's url by its id from storage
  const getAudioUrl = useMutation(api.podcasts.getUrl);
  // -------------------------------------------------------------------------

  const generatePodcast = async () => {
    setIsGenerating(true);
    // -------------------------------------------------------------------------
    // Rest previous generated audio
    args.setAudio("");
    // -------------------------------------------------------------------------
    // If no prompt, return
    if (!args.voicePrompt) {
      toast({
        title: "Please select a Voice Type to generate audio",
        variant: "warning",
      });
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

      // Start the file upload to Convex
      const uploaded = await startUpload([file]);
      // Get the storage id of the file from upload response
      const storageId = (uploaded[0].response as any).storageId;

      // Get the uploaded file's url from Convex storage using our custom mutation
      const audioUrl = await getAudioUrl({ storageId });

      // -----------------------------------------------------------------------
      // Update parent form's state
      args.setAudioStorageId(storageId);
      args.setAudio(audioUrl!);

      // -----------------------------------------------------------------------
      toast({
        title: "Podcast generated successfully",
      });
      setIsGenerating(false);
      // -----------------------------------------------------------------------
    } catch (error) {
      // -----------------------------------------------------------------------
      toast({
        title: "Error occurred while generating podcast",
        variant: "destructive",
      });
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
          onClick={generatePodcast}
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
