import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.status(200).json({
    models: [
      {
        id: "ai_enhance",
        name: "AI Master Enhance",
        category: "enhancement",
      },
      {
        id: "face_enhance",
        name: "GFPGAN Face Enhancement",
        category: "portrait",
      },
      {
        id: "portrait_enhance",
        name: "Portrait AI Pro",
        category: "portrait",
      },
      {
        id: "sharpen",
        name: "AI High-Pass Sharpen",
        category: "sharpening",
      },
      {
        id: "denoise",
        name: "Bilateral AI Denoise",
        category: "restoration",
      },
      {
        id: "color_enhance",
        name: "Neural Color Expander",
        category: "color",
      },
      {
        id: "remove_artifacts",
        name: "JPEG Deblock & Artifact Removal",
        category: "restoration",
      },
      {
        id: "upscale_2x",
        name: "Real-ESRGAN 2x Upscale",
        category: "upscale",
      },
      {
        id: "upscale_4x",
        name: "Real-ESRGAN 4x Upscale",
        category: "upscale",
      },
      {
        id: "upscale_8x",
        name: "Real-ESRGAN 8x Ultra Upscale",
        category: "upscale",
      },
    ],
  });
}