import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.status(200).json({
    status: "ok",
    service: "JS Ai Hub Enhance AI Server",
    timestamp: new Date().toISOString(),
  });
}