import React, { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import Image from "next/image";
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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface IProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}

const GenerateThumbnail: FC<IProps> = (props) => {
  // ---------------------------------------------------------------------------
  // To display messages
  const { toast } = useToast();
  // ---------------------------------------------------------------------------
  // Which option is selected by user? (AI Image or Direct Upload)
  const [isAIThumbnail, setIsAIThumbnail] = useState(false);
  // ---------------------------------------------------------------------------
  // Is Image being generated or uploaded by user
  const [isImageLoading, setIsImageLoading] = useState(false);
  // ---------------------------------------------------------------------------
  // Ref to the image input
  const imageRef = useRef<HTMLInputElement>(null);
  // ---------------------------------------------------------------------------
  // File Upload Helpers:
  // Integrate Convex mutation and UploadStuff
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  // Get the Convex mutation that returns the uploaded file's url by its id from storage
  const getImageUrl = useMutation(api.podcasts.getUrl);
  // ---------------------------------------------------------------------------
  // Get the OpenAI Action from the Convex API
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Custom function to handle image upload to Convex storage
  const handleImage = async (blob: Blob, fileName: string) => {
    // -------------------------------------------------------------------------
    setIsImageLoading(true);
    // -------------------------------------------------------------------------
    // Rest previous generated audio
    props.setImage("");
    // -------------------------------------------------------------------------
    try {
      // Convert the Blob to a File object
      const file = new File([blob], fileName, { type: "image/png" });
      // Start the file upload to Convex
      const uploaded = await startUpload([file]);
      // Get the storage id of the file from upload response
      const storageId = (uploaded[0].response as any).storageId;

      // Get the uploaded file's url from Convex storage using our custom mutation
      const imageUrl = await getImageUrl({ storageId });
      // -----------------------------------------------------------------------
      // Update parent form's state
      props.setImageStorageId(storageId);
      props.setImage(imageUrl!);
      // -----------------------------------------------------------------------
      toast({
        title: "Thumbnail generated successfully",
      });
      setIsImageLoading(false);
      // -----------------------------------------------------------------------
    } catch (error) {
      // -----------------------------------------------------------------------
      console.error(error);
      toast({ title: "Error generating thumbnail", variant: "destructive" });
      // -----------------------------------------------------------------------
    }
  };
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Generate AI Image handler
  const generateImage = async () => {
    try {
      // -----------------------------------------------------------------------
      // Invoke the Convex Action to generate a new image
      const response = await handleGenerateThumbnail({
        prompt: props.imagePrompt,
      });
      // -----------------------------------------------------------------------
      // Retrieve the image from the response of the Convex Action
      const blob = new Blob([response], { type: "image/png" });
      // -----------------------------------------------------------------------
      // Pass the Convex storage logic to our custom function
      handleImage(blob, `thumbnail-${uuidv4()}`);
      // -----------------------------------------------------------------------
    } catch (error) {
      // -----------------------------------------------------------------------
      console.error(error);
      toast({ title: "Error generating thumbnail", variant: "destructive" });
      // -----------------------------------------------------------------------
    }
  };
  // ---------------------------------------------------------------------------
  // User Upload image handler
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // -------------------------------------------------------------------------
    e.preventDefault();
    // -------------------------------------------------------------------------
    try {
      // -----------------------------------------------------------------------
      // Get the selected file
      const files = e.target.files;
      if (!files) return;
      // -----------------------------------------------------------------------
      // Convert the selected file to Blob
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      // -----------------------------------------------------------------------
      // Pass the Convex storage logic to our custom function
      handleImage(blob, file.name);
      // -----------------------------------------------------------------------
    } catch (error) {
      // -----------------------------------------------------------------------
      console.error(error);
      toast({ title: "Error uploading image", variant: "destructive" });
      // -----------------------------------------------------------------------
    }
  };
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Select if user wants to use AI to generate thumbnail or upload */}
      {/* ------------------------------------------------------------------ */}
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAIThumbnail(true)}
          className={cn("", { "bg-black-6": isAIThumbnail })}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAIThumbnail(false)}
          className={cn("", { "bg-black-6": !isAIThumbnail })}
        >
          Upload custom image
        </Button>
      </div>
      {/* ------------------------------------------------------------------ */}
      {/* Display AI prompt input if isAIThumbnail is true */}
      {/* ------------------------------------------------------------------ */}
      {isAIThumbnail ? (
        <div>
          {/* -------------------------------------------------------------- */}
          {/* Image Prompt */}
          <div className="flex flex-col gap-2.5 mt-5">
            {/* Label */}
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate podcast thumbnail
            </Label>
            {/* Prompt Textarea */}
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Prompt the AI to generate the podcast thumbnail"
              rows={5}
              value={props.imagePrompt}
              onChange={(e) => props.setImagePrompt(e.target.value)}
            />
          </div>
          {/* -------------------------------------------------------------- */}
          {/* Button */}
          <div className="mt-5 w-full max-w-[200px]">
            <Button
              type="submit"
              className="text-16 font-bold bg-orange-1 text-white-1 py-4 transition-all duration-500 hover:bg-orange-900"
              onClick={generateImage}
            >
              {isImageLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        // ---------------------------------------------------------------------
        // ---------------------------------------------------------------------
        // Upload Image Button
        // ---------------------------------------------------------------------
        <div className="image_div" onClick={() => imageRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            // Upload Icon
            <Image
              src="/icons/upload-image.svg"
              width={40}
              height={40}
              alt="upload"
            />
          ) : (
            // Uploading Loader (Spinner)
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG, or GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------ */}
      {/* Display Uploaded/Generated Image */}
      {props.image && (
        <div className="flex-center w-full">
          <Image
            src={props.image}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
      {/* ------------------------------------------------------------------ */}
    </>
  );
};

export default GenerateThumbnail;
