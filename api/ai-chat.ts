import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only POST is allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    // Read request body
    const { message, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required.",
      });
    }

    // Create Gemini client
    const ai = new GoogleGenAI({
      apiKey,
    });

    // Build conversation context
    let prompt = "";

    if (Array.isArray(history) && history.length > 0) {
      prompt += `Previous conversation:\n\n`;

      for (const item of history) {
        if (!item) continue;

        const role =
          item.role === "assistant" || item.role === "model"
            ? "Assistant"
            : "User";

        const text =
          typeof item.content === "string"
            ? item.content
            : typeof item.text === "string"
            ? item.text
            : "";

        if (text) {
          prompt += `${role}: ${text}\n`;
        }
      }

      prompt += `\n`;
    }

    prompt += `User: ${message}\n\nAssistant:`;

    // Gemini request
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const reply = response.text || "Sorry, I couldn't generate a response.";

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the AI response.",
    });
  }
}