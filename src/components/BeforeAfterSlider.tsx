import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Columns, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Download, 
  Check, 
  X, 
  Sparkles, 
  Move,
  ZoomIn,
  ZoomOut,
  Sliders
} from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeTitle?: string;
  afterTitle?: string;
  beforeDimensions?: { width: number; height: number };
  afterDimensions?: { width: number; height: number };
  modelUsed?: string;
  processingTimeMs?: number;
  onApply: () => void;
  onClose: () => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeUrl,
  afterUrl,
  beforeTitle = 'Original',
  afterTitle = 'AI Enhanced',
  beforeDimensions,
  afterDimensions,
  modelUsed = 'Real-ESRGAN / GFPGAN Neural Pipeline',
  processingTimeMs,
  onApply,
  onClose
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'hold'>('split');
  const [holdShowOriginal, setHoldShowOriginal] = useState<boolean>(false);

  // Zoom & Pan
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current || viewMode !== 'split') return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      setSliderPosition(percentage);
    },
    [viewMode]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      if (zoom > 1.0) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      } else {
        setIsDragging(true);
        handleMove(e.clientX);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  // Touch support for mobile / iframe
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  // Download Enhanced
  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `AI-Enhanced-Photo-${Date.now()}.png`;
    link.href = afterUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-3 sm:p-6 select-none font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/40 flex items-center justify-center shadow-lg shadow-violet-950/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              Before vs After AI Comparison
              {processingTimeMs && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  {processingTimeMs}ms
                </span>
              )}
            </h3>
            <p className="text-[11px] text-zinc-400 flex items-center gap-2 font-mono">
              <span>Model: {modelUsed}</span>
              {afterDimensions && (
                <span className="text-violet-400 font-bold">
                  ({afterDimensions.width} × {afterDimensions.height} px)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-2xl border border-zinc-800 text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'split'
                ? 'bg-violet-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Split Slider</span>
          </button>

          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-violet-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Side-by-Side</span>
          </button>

          <button
            onMouseDown={() => setHoldShowOriginal(true)}
            onMouseUp={() => setHoldShowOriginal(false)}
            onTouchStart={() => setHoldShowOriginal(true)}
            onTouchEnd={() => setHoldShowOriginal(false)}
            className="px-3 py-1.5 rounded-xl text-zinc-300 hover:text-violet-400 hover:bg-zinc-800 font-bold flex items-center gap-1.5 transition-all"
            title="Press & Hold to see Original"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Hold Compare</span>
          </button>
        </div>
      </div>

      {/* Main Image Comparison Area */}
      <div className="flex-1 my-3 relative overflow-hidden rounded-3xl border border-violet-900/40 bg-zinc-950 flex items-center justify-center shadow-2xl">
        {/* SIDE-BY-SIDE MODE */}
        {viewMode === 'side-by-side' ? (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
            {/* Before Box */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/60 border border-zinc-800 flex items-center justify-center">
              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
                {beforeTitle} {beforeDimensions ? `(${beforeDimensions.width}×${beforeDimensions.height})` : ''}
              </span>
              <img
                src={beforeUrl}
                alt="Before"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* After Box */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/60 border border-violet-500/40 flex items-center justify-center">
              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-violet-500/90 backdrop-blur-md text-[10px] font-mono font-bold text-black shadow-lg">
                ✨ {afterTitle} {afterDimensions ? `(${afterDimensions.width}×${afterDimensions.height})` : ''}
              </span>
              <img
                src={afterUrl}
                alt="After"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        ) : (
          /* SPLIT SLIDER MODE */
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
            className="relative w-full h-full flex items-center justify-center select-none cursor-ew-resize overflow-hidden"
          >
            {/* AFTER IMAGE (Base Layer) */}
            <img
              src={holdShowOriginal ? beforeUrl : afterUrl}
              alt="Enhanced"
              className="max-w-full max-h-full object-contain pointer-events-none shadow-2xl"
            />

            {/* BEFORE IMAGE (Clipped Layer) */}
            {!holdShowOriginal && (
              <div
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <img
                  src={beforeUrl}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* SLIDER HANDLE LINE */}
            {!holdShowOriginal && (
              <div
                style={{ left: `${sliderPosition}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-violet-400 shadow-[0_0_12px_#34d399] z-20 pointer-events-none"
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-violet-400 text-black border-2 border-black flex items-center justify-center shadow-2xl">
                  <Columns className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Floating Labels */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-amber-500/90 text-black text-[10px] font-mono font-black shadow-lg">
                {beforeTitle}
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-violet-500/90 text-black text-[10px] font-mono font-black shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {afterTitle}
              </span>
            </div>
          </div>
        )}

        {/* Bottom Floating Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-2xl border border-violet-500/30 text-white shadow-xl">
          <button
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.25))}
            className="p-1.5 rounded-xl hover:bg-violet-500/20 hover:text-violet-400"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono w-10 text-center font-bold text-violet-400">
            {(zoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(4.0, prev + 0.25))}
            className="p-1.5 rounded-xl hover:bg-violet-500/20 hover:text-violet-400"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3 bg-zinc-800 mx-0.5" />
          <button
            onClick={() => {
              setZoom(1.0);
              setPan({ x: 0, y: 0 });
            }}
            className="px-2 py-1 rounded-xl text-[10px] font-mono text-zinc-300 hover:text-violet-400"
          >
            Fit
          </button>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <X className="w-4 h-4" /> Discard
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-violet-400 border border-violet-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Download Result
          </button>

          <button
            onClick={onApply}
            className="px-6 py-2.5 rounded-2xl bg-violet-500 hover:bg-violet-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-violet-950/50 transition-transform active:scale-95"
          >
            <Check className="w-4 h-4" /> Apply to Studio Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
