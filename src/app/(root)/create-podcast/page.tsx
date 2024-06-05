"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader } from "lucide-react";
import { Id } from "@/../convex/_generated/dataModel";
// import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useRouter } from "next/navigation";

// -----------------------------------------------------------------------------

const voiceCategories = ["alloy", "shimmer", "nova", "echo", "fable", "onyx"];

// -----------------------------------------------------------------------------
// Zod validation schema
const formSchema = z.object({
  podcastTitle: z.string().min(2),
  podcastDescription: z.string().min(2),
});

// -----------------------------------------------------------------------------

const CreatePodcast = () => {
  // ---------------------------------------------------------------------------
  const router = useRouter();
  // ---------------------------------------------------------------------------
  // Selected AI Voice State
  const [voiceType, setVoiceType] = useState<string | null>(null);
  // ---------------------------------------------------------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ---------------------------------------------------------------------------
  // Generated Podcast Audio States
  const [voicePrompt, setVoicePrompt] = useState("");

  const [audioUrl, setAudioUrl] = useState("");
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [audioDuration, setAudioDuration] = useState(0);
  // ---------------------------------------------------------------------------
  // Thumbnail States
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState("");
  // ---------------------------------------------------------------------------
  // const createPodcast = useMutation(api.podcasts.createPodcast);
  // ---------------------------------------------------------------------------
  // const { toast } = useToast()
  // ---------------------------------------------------------------------------
  // 1. Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Form's default values
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  // ---------------------------------------------------------------------------
  // 2. Define a submit handler
  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    // try {
    //   setIsSubmitting(true);
    //   if(!audioUrl || !imageUrl || !voiceType) {
    //     toast({
    //       title: 'Please generate audio and image',
    //     })
    //     setIsSubmitting(false);
    //     throw new Error('Please generate audio and image')
    //   }

    //   const podcast = await createPodcast({
    //     podcastTitle: data.podcastTitle,
    //     podcastDescription: data.podcastDescription,
    //     audioUrl,
    //     imageUrl,
    //     voiceType,
    //     imagePrompt,
    //     voicePrompt,
    //     views: 0,
    //     audioDuration,
    //     audioStorageId: audioStorageId!,
    //     imageStorageId: imageStorageId!,
    //   })
    //   toast({ title: 'Podcast created' })
    //   setIsSubmitting(false);
    //   router.push('/')
    // } catch (error) {
    //   console.log(error);
    //   toast({
    //     title: 'Error',
    //     variant: 'destructive',
    //   })
    //   setIsSubmitting(false);
    // }
  }

  // ---------------------------------------------------------------------------
  return (
    <section className="mt-10 flex flex-col">
      <div>
        <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex flex-col w-full"
        >
          {/* -------------------------------------------------------------- */}
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            {/* ------------------------------------------------------------ */}
            {/* Podcast Title: */}
            {/* ------------------------------------------------------------ */}
            {/* Form Field */}
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  {/* Label */}
                  <FormLabel className="text-16 font-bold text-white-1">
                    Podcast Title
                  </FormLabel>
                  {/* Control > Input */}
                  <FormControl>
                    <Input
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Podcast Title"
                      {...field}
                    />
                  </FormControl>
                  {/* Message */}
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
            {/* ------------------------------------------------------------ */}
            {/* Select Voice */}
            {/* ------------------------------------------------------------ */}
            {/* Form Field */}
            <div className="flex flex-col gap-2.5">
              {/* Label */}
              <Label className="text-16 font-bold text-white-1">
                Select AI Voice
              </Label>
              {/* Select Control */}
              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger
                  className={cn(
                    "text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1"
                  )}
                >
                  {/* Default Value */}
                  <SelectValue
                    placeholder="Select AI Voice"
                    className="placeholder:text-gray-1 "
                  />
                </SelectTrigger>
                {/* Select Options */}
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-offset-orange-1">
                  {voiceCategories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="capitalize focus:bg-orange-1"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
                {/* If voice type is selected, play audio demo */}
                {voiceType && (
                  <audio
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>
            {/* ------------------------------------------------------------ */}
            {/* Podcast Description */}
            {/* ------------------------------------------------------------ */}
            {/* Form Field */}
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  {/* Label */}
                  <FormLabel className="text-16 font-bold text-white-1">
                    Podcast Description
                  </FormLabel>
                  {/* Control > Input */}
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Write a short podcast description"
                      {...field}
                    />
                  </FormControl>
                  {/* Message */}
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
            {/* ------------------------------------------------------------ */}
          </div>
          {/* -------------------------------------------------------------- */}
          {/* AI Components Section */}
          {/* -------------------------------------------------------------- */}
          <div className="flex flex-col pt-10">
            {/* ------------------------------------------------------------ */}
            {/* Generate Podcast Audio */}
            <GeneratePodcast
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              voiceType={voiceType!}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />
            {/* ------------------------------------------------------------ */}
            {/* Generate Podcast Thumbnail */}
            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
            />
            {/* ------------------------------------------------------------ */}
          </div>
          {/* -------------------------------------------------------------- */}
          {/* Submit Button */}
          {/* -------------------------------------------------------------- */}
          <div className="mt-10 w-full">
            <Button
              type="submit"
              className="text-16 w-full bg-orange-1 text-white-1 py-4 font-extrabold transition-all duration-500 hover:bg-orange-900"
            >
              {isSubmitting ? (
                <>
                  Submitting
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Submit & Publish Podcast"
              )}
            </Button>
          </div>
          {/* -------------------------------------------------------------- */}
        </form>
      </Form>
    </section>
  );
};

export default CreatePodcast;
