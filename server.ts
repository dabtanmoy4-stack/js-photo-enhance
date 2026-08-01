import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { aiEnhanceManager, AIEnhanceRequest } from './src/server/aiEnhancer';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON parsing with large limits for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'JS Photo Enhance AI Server',
      timestamp: new Date().toISOString()
    });
  });

  // Available AI Enhancement Models & Capabilities
  app.get('/api/ai-models', (req, res) => {
    res.json({
      models: [
        {
          id: 'ai_enhance',
          name: 'AI Master Enhance',
          description: 'Auto detail extraction, contrast dynamics balance & clarity boost.',
          category: 'enhancement'
        },
        {
          id: 'face_enhance',
          name: 'GFPGAN Face Enhancement',
          description: 'Facial landmark restoration, eye clarity & skin texture recovery.',
          category: 'portrait'
        },
        {
          id: 'portrait_enhance',
          name: 'Portrait AI Pro',
          description: 'Subject isolation, skin warmth & subtle depth glow.',
          category: 'portrait'
        },
        {
          id: 'sharpen',
          name: 'AI High-Pass Sharpen',
          description: 'High-frequency unsharp masking & sub-pixel edge reconstruction.',
          category: 'sharpening'
        },
        {
          id: 'denoise',
          name: 'Bilateral AI Denoise',
          description: 'Spatial bilateral noise reduction & ISO grain removal.',
          category: 'restoration'
        },
        {
          id: 'color_enhance',
          name: 'Neural Color Expander',
          description: 'Auto white-balance & RGB color gamut expansion.',
          category: 'color'
        },
        {
          id: 'remove_artifacts',
          name: 'JPEG Deblock & Artifact Removal',
          description: 'Removes 8x8 DCT block boundaries & compression ringing.',
          category: 'restoration'
        },
        {
          id: 'upscale_2x',
          name: 'Real-ESRGAN 2x Upscale',
          description: '200% Neural Super-Resolution pixel expansion.',
          category: 'upscale'
        },
        {
          id: 'upscale_4x',
          name: 'Real-ESRGAN 4x Upscale',
          description: '400% Neural Super-Resolution pixel expansion.',
          category: 'upscale'
        },
        {
          id: 'upscale_8x',
          name: 'Real-ESRGAN 8x Ultra Upscale',
          description: '800% Neural Super-Resolution ultra high-res expansion.',
          category: 'upscale'
        }
      ],
      architecture: {
        provider: 'Real-ESRGAN + GFPGAN + Gemini 3.1 Flash Image Engine',
        pluggableRemoteEndpointSupported: true
      }
    });
  });

  // Main AI Enhancement API Route
  app.post('/api/ai-enhance', async (req, res) => {
    try {
      const requestData: AIEnhanceRequest = req.body;

      if (!requestData || !requestData.imageData || !requestData.mode) {
        return res.status(400).json({
          error: 'Missing required fields: imageData and mode are required.'
        });
      }

      console.log(`[AI Server] Processing request mode: ${requestData.mode}`);
      const result = await aiEnhanceManager.processRequest(requestData);

      return res.json(result);
    } catch (error: any) {
      console.error('[AI Server Error]:', error);
      return res.status(500).json({
        error: error?.message || 'Failed to execute AI enhancement pipeline.',
        success: false
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
