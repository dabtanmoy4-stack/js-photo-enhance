import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

import {
  aiEnhanceManager,
  type AIEnhanceRequest,
} from "../src/server/aiEnhancer";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const requestData = req.body as AIEnhanceRequest;

    if (
      !requestData ||
      !requestData.imageData ||
      !requestData.mode
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: imageData and mode",
      });
    }

    const result = await aiEnhanceManager.processRequest(requestData);

    return res.status(200).json(result);

  } catch (error: any) {
    console.error("AI Enhance Error:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error",
    });
  }
}