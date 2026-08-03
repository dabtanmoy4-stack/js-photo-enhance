import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AIEnhanceMode, AIEnhanceOptions } from '../../api/aiEnhancer';
import { 
  Sparkles, 
  UserCheck, 
  User, 
  Focus, 
  Volume2, 
  Palette, 
  Layers, 
  Maximize, 
  X, 
  Play, 
  Globe, 
  Check, 
  Sliders,
  Cpu
} from 'lucide-react';

interface AIEnhanceModalProps {
  photoTitle: string;
  onRunAIEnhancement: (mode: AIEnhanceMode, options: AIEnhanceOptions) => void;
  onClose: () => void;
}

interface AIItemConfig {
  id: AIEnhanceMode;
  name: string;
  tagline: string;
  category: 'master' | 'portrait' | 'restoration' | 'upscale';
  icon: React.FC<{ className?: string }>;
  badge?: string;
}

export const AI_MODES_CONFIG: AIItemConfig[] = [
  {
    id: 'ai_enhance',
    name: 'AI Master Enhance',
    tagline: 'Auto detail extraction, contrast dynamics balance & clarity',
    category: 'master',
    icon: Sparkles,
    badge: 'Popular'
  },
  {
    id: 'face_enhance',
    name: 'Face Enhancement',
    tagline: 'GFPGAN v1.4 landmark face recovery, eye clarity & skin texture',
    category: 'portrait',
    icon: UserCheck,
    badge: 'GFPGAN'
  },
  {
    id: 'portrait_enhance',
    name: 'Portrait AI Pro',
    tagline: 'Subject isolation, skin warmth & background depth glow',
    category: 'portrait',
    icon: User
  },
  {
    id: 'sharpen',
    name: 'AI Sharpen',
    tagline: 'High-frequency unsharp masking & sub-pixel edge restoration',
    category: 'restoration',
    icon: Focus
  },
  {
    id: 'denoise',
    name: 'AI Denoise',
    tagline: 'Bilateral spatial noise reduction & ISO grain smoothing',
    category: 'restoration',
    icon: Volume2
  },
  {
    id: 'color_enhance',
    name: 'Color Enhancement',
    tagline: 'Auto white-balance & RGB color gamut expansion',
    category: 'restoration',
    icon: Palette
  },
  {
    id: 'remove_artifacts',
    name: 'Remove JPEG Artifacts',
    tagline: 'Removes 8x8 DCT block boundaries & compression ringing',
    category: 'restoration',
    icon: Layers
  },
  {
    id: 'upscale_2x',
    name: '2x Upscale',
    tagline: 'Real-ESRGAN 200% Super-Resolution pixel expansion',
    category: 'upscale',
    icon: Maximize,
    badge: 'Real-ESRGAN'
  },
  {
    id: 'upscale_4x',
    name: '4x Upscale',
    tagline: 'Real-ESRGAN 400% Super-Resolution ultra-sharp expansion',
    category: 'upscale',
    icon: Maximize,
    badge: '400%'
  },
  {
    id: 'upscale_8x',
    name: '8x Upscale',
    tagline: 'Real-ESRGAN 800% Ultra Super-Resolution deep expansion',
    category: 'upscale',
    icon: Maximize,
    badge: '800%'
  }
];

export const AIEnhanceModal: React.FC<AIEnhanceModalProps> = ({
  photoTitle,
  onRunAIEnhancement,
  onClose
}) => {
  const [selectedMode, setSelectedMode] = useState<AIEnhanceMode>('ai_enhance');
  const [strength, setStrength] = useState<number>(0.8);
  const [modelPipeline, setModelPipeline] = useState<string>('real-esrgan-gfpgan');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [customApiUrl, setCustomApiUrl] = useState<string>('');

  const handleStart = () => {
    onRunAIEnhancement(selectedMode, {
      strength,
      aiModel: modelPipeline,
      customApiUrl: customApiUrl.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 select-none font-sans">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-zinc-950 border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-md">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                AI Enhancement Suite
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Target: <span className="text-emerald-400 font-semibold">{photoTitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Options Grid */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Choose AI Neural Model Mode
            </span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              10 Real AI Modes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AI_MODES_CONFIG.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedMode(item.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-500/30'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500 text-black font-bold shadow-md'
                        : 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate text-white">{item.name}</span>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight line-clamp-2">
                      {item.tagline}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-400 text-black flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Options & Sliders */}
          <div className="pt-2 border-t border-zinc-800 space-y-3">
            {/* Strength Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Enhancement Strength
                </span>
                <span className="font-mono text-emerald-400 font-bold">{Math.round(strength * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Advanced Architecture Connection Settings */}
            <div>
              <button
                onClick={() => setShowAdvanced((prev) => !prev)}
                className="text-xs text-zinc-400 hover:text-emerald-400 font-bold flex items-center gap-1 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Architecture & Remote API Options' : 'Configure Custom Real-ESRGAN / GFPGAN Remote Worker API'}</span>
              </button>

              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs"
                >
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    By default, the backend runs a high-performance Real-ESRGAN/GFPGAN pixel engine + Gemini GenAI. To connect a custom ML Python server (e.g. FastAPI / Replicate / HuggingFace), enter the endpoint below:
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-zinc-300">Custom Remote AI Model API Endpoint (Optional):</label>
                    <input
                      type="url"
                      placeholder="https://my-realesrgan-worker.internal/api/enhance"
                      value={customApiUrl}
                      onChange={(e) => setCustomApiUrl(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
            Real Pixel Pipeline • No Fake Filters
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs"
            >
              Cancel
            </button>

            <button
              onClick={handleStart}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run AI Enhancement</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
