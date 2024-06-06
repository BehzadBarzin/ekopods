import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Define a Convex Action to handle AI request:
 *
 * Learn about Convex Actions: https://docs.convex.dev/functions/actions
 */

// -----------------------------------------------------------------------------
// Define Action Handler:
export const generateAudioAction = action({
  // Arguments that we pass to the action
  args: { input: v.string(), voice: v.string() },
  // Handler function that will be called when the action is triggered
  handler: async (_, { voice, input }) => {
    // Generate the audio using Unrealspeech
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.UNREAL_SPEECH_API_KEY}`,
      },
      body: JSON.stringify({
        Text: input, // The text to convert to speech
        VoiceId: voice, // The voice to use
        Bitrate: "192k",
        Speed: "0",
        Pitch: "1",
        TimestampType: "sentence",
      }),
    };

    // Docs: https://docs.unrealspeech.com/reference/speech

    const res: Response = await fetch(
      "https://api.v6.unrealspeech.com/speech",
      options
    );

    // Res contains the URL to generated mp3 file
    const jsonResponse = await res.json();
    // Download it
    const audioResponse = await fetch(jsonResponse.OutputUri);

    // Convert to arrayBuffer
    const audioBuffer = await audioResponse.arrayBuffer();

    // Return the buffer
    return audioBuffer;
  },
});

// -----------------------------------------------------------------------------
// Define Action Handler:
export const generateThumbnailAction = action({
  // Arguments that we pass to the action
  args: { prompt: v.string() },
  // Handler function that will be called when the action is triggered
  handler: async (_, { prompt }) => {
    // Generate the image using LimeWire
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Version": "v1",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.LIME_WIRE_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt, // The prompt to generate the image
        aspect_ratio: "1:1",
        quality: "MID",
      }),
    };

    // Docs: https://docs.limewire.com/#operation/generateImage

    const res = await fetch(
      `https://api.limewire.com/api/image/generation`,
      options
    );

    // Res contains the URL to generated image file
    const jsonResponse = await res.json();

    const imageUrl = jsonResponse.data[0].asset_url;

    // Download it
    const imageResponse = await fetch(imageUrl);

    // Convert to arrayBuffer
    const audioBuffer = await imageResponse.arrayBuffer();

    // Return the buffer
    return audioBuffer;
  },
});
