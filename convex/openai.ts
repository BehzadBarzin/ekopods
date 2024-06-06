import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech";

/**
 * Define a Convex Action to handle OpenAI request:
 *
 * Learn about Convex Actions: https://docs.convex.dev/functions/actions
 */

// -----------------------------------------------------------------------------
// Initialize the OpenAI Client:
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// -----------------------------------------------------------------------------
// Define Action Handler:
export const generateAudioAction = action({
  // Arguments that we pass to the action
  args: { input: v.string(), voice: v.string() },
  // Handler function that will be called when the action is triggered
  handler: async (_, { voice, input }) => {
    // Call OpenAI API to generate audio
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Define the AI model to use
      voice: voice as SpeechCreateParams["voice"], // Define the voice to use
      input, // Define the input text (prompt)
    });

    // Convert the audio to a buffer
    const buffer = await mp3.arrayBuffer();

    // Return the buffer
    return buffer;
  },
});

// -----------------------------------------------------------------------------
// Define Action Handler:
export const generateThumbnailAction = action({
  // Arguments that we pass to the action
  args: { prompt: v.string() },
  // Handler function that will be called when the action is triggered
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: "dall-e-3", // Define the AI model to use
      prompt, // The input text (prompt)
      size: "1024x1024", // Image size
      quality: "standard", // Image quality
      n: 1, // Number of images to generate
    });

    // Get the URL of the generated image
    const url = response.data[0].url;

    // If the URL is null, throw an error
    if (!url) {
      throw new Error("Error generating thumbnail");
    }

    // Download image
    const imageResponse = await fetch(url);
    // Convert image to buffer
    const buffer = await imageResponse.arrayBuffer();
    // Return the buffer of the generated image
    return buffer;
  },
});
