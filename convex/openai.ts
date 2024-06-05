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
