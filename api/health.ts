import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.status(200).json({
    status: "ok",
    service: "JS Photo Enhance AI Server",
    timestamp: new Date().toISOString(),
  });
}