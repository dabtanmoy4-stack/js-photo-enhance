import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY is not configured.",
      });
    }

    // Read request body
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required.",
      });
    }

    // Build conversation messages
    const messages = [
      {
        role: "system" as const,
        content: `
You are JS AI Assistant, the official AI assistant of JS AI Hub.

Your name is JS AI Assistant.

Never identify yourself as Gemini, Google Gemini, Groq, Llama,
GPT, or any other AI model.

If the user asks your name, say:
"My name is JS AI Assistant."

You are friendly, helpful, intelligent, and conversational.

You can communicate naturally in English and Bengali.

If the user speaks Bengali, respond in Bengali.
If the user speaks English, respond in English.

Give clear, useful and natural answers.

Now answer the user's message naturally.
        `.trim(),
      },

      // Previous conversation
      ...(Array.isArray(history)
        ? history
            .filter((item: any) => item)
            .map((item: any) => {
              const role =
                item.role === "assistant" ||
                item.role === "ai" ||
                item.role === "model"
                  ? "assistant"
                  : "user";

              const text =
                typeof item.content === "string"
                  ? item.content
                  : typeof item.text === "string"
                  ? item.text
                  : "";

              return {
                role: role as "user" | "assistant",
                content: text,
              };
            })
            .filter((item: any) => item.content),
        : []),

      // Current message
      {
        role: "user" as const,
        content: message,
      },
    ];

    // ================= GROQ REQUEST =================

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      temperature: 0.7,
      max_completion_tokens: 2048,
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Groq AI Chat Error:", error);

    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while generating the AI response.",
    });
  }
}