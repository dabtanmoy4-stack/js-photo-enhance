import { aiEnhanceManager } from "../src/server/aiEnhancer";

export default async function handler(req: any, res: any) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const requestData = req.body;

    if (!requestData || !requestData.imageData || !requestData.mode) {
      return res.status(400).json({
        success: false,
        error: "Missing imageData or mode"
      });
    }

    console.log(
      `[Vercel API] Processing AI mode: ${requestData.mode}`
    );

    const result = await aiEnhanceManager.processRequest(requestData);

    return res.status(200).json(result);

  } catch (error: any) {

    console.error(
      "[Vercel AI Error]",
      error
    );

    return res.status(500).json({
      success: false,
      error: error?.message || "AI Enhancement failed"
    });
  }
}