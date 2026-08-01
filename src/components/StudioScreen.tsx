import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AppViewModel } from '../viewmodel/useAppViewModel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  RotateCcw, 
  Undo2,
  Redo2,
  Save, 
  Eye, 
  Sparkles, 
  Sun, 
  Contrast, 
  Aperture, 
  Flame, 
  Focus, 
  Wand2, 
  Download,
  Image as ImageIcon,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crop as CropIcon,
  X,
  Check,
  Move,
  Upload,
  Clipboard,
  Minimize2,
  Zap,
  Thermometer,
  Palette,
  Moon,
  Volume2,
  Layers
} from 'lucide-react';
import { PresetFilter, CropRect } from '../types';
import { UploadDropZone } from './UploadDropZone';

interface StudioScreenProps {
  vm: AppViewModel;
}

export const StudioScreen: React.FC<StudioScreenProps> = ({ vm }) => {
  const photo = vm.selectedPhoto;
  const { adjustments } = vm;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active Tool Mode Tab: 'transform' | 'adjust' | 'presets' | 'upload'
  const [activeToolTab, setActiveToolTab] = useState<'transform' | 'adjust' | 'presets' | 'upload'>('transform');

  // Spatial Transformation States
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.0); // 0.5 to 5.0
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fullscreen Preview Modal State
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);

  // Crop Mode States
  const [isCropMode, setIsCropMode] = useState<boolean>(false);
  const [cropRect, setCropRect] = useState<CropRect>({ x: 10, y: 10, width: 80, height: 80 });
  const [selectedAspect, setSelectedAspect] = useState<string>('free');

  // Drag over drop state on preview area
  const [isDragOverCanvas, setIsDragOverCanvas] = useState<boolean>(false);

  // Reset spatial transformations & adjustments when photo changes
  useEffect(() => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setIsCropMode(false);
    setCropRect({ x: 10, y: 10, width: 80, height: 80 });
  }, [photo?.id]);

  // Spatial Transformation Action Handlers
  const handleRotateLeft = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const handleRotateRight = () => setRotation((prev) => (prev + 90) % 360);
  const handleToggleFlipH = () => setFlipH((prev) => !prev);
  const handleToggleFlipV = () => setFlipV((prev) => !prev);

  const handleZoomIn = () => setZoom((prev) => Math.min(5.0, Number((prev + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.25, Number((prev - 0.25).toFixed(2))));
  const handleFitToScreen = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleResetAll = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setIsCropMode(false);
    vm.resetAdjustments();
    vm.showToast('Reset all edits & transformations');
  };

  // Mouse wheel zoom on preview canvas
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(5.0, Number((prev + 0.1).toFixed(2))));
    } else {
      setZoom((prev) => Math.max(0.25, Number((prev - 0.1).toFixed(2))));
    }
  };

  // Pan Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCropMode) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || isCropMode) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Aspect Ratio Preset Handler for Crop
  const handleAspectChange = (aspect: string) => {
    setSelectedAspect(aspect);
    switch (aspect) {
      case '1:1':
        setCropRect({ x: 15, y: 15, width: 70, height: 70 });
        break;
      case '4:3':
        setCropRect({ x: 10, y: 17.5, width: 80, height: 60 });
        break;
      case '16:9':
        setCropRect({ x: 5, y: 22.5, width: 90, height: 50.6 });
        break;
      case '9:16':
        setCropRect({ x: 25, y: 5, width: 50, height: 88.8 });
        break;
      case '3:2':
        setCropRect({ x: 10, y: 16.6, width: 80, height: 53.3 });
        break;
      case 'free':
      default:
        setCropRect({ x: 10, y: 10, width: 80, height: 80 });
        break;
    }
  };

  // Render Canvas with Filters, Rotation, Flip
  const drawToCanvas = useCallback((targetCanvas: HTMLCanvasElement, isRawCompare = false) => {
    if (!photo) return;
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photo.url;

    img.onload = () => {
      const is90or270 = rotation === 90 || rotation === 270;
      const srcWidth = img.width;
      const srcHeight = img.height;

      targetCanvas.width = is90or270 ? srcHeight : srcWidth;
      targetCanvas.height = is90or270 ? srcWidth : srcHeight;

      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.save();

      // Move center
      ctx.translate(targetCanvas.width / 2, targetCanvas.height / 2);

      // Rotation & Flips
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      if (isRawCompare) {
        ctx.filter = 'none';
        ctx.drawImage(img, -srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);
        ctx.restore();
        return;
      }

      // 1. Calculate combined CSS base filters (Brightness + Exposure, Contrast, Saturation, Blur)
      const totalBrightness = 100 + adjustments.brightness + Math.round((adjustments.exposure || 0) * 0.8);
      const totalContrast = 100 + adjustments.contrast;
      const totalSaturate = 100 + adjustments.saturation;
      const blurPx = adjustments.blur || 0;

      ctx.filter = `brightness(${totalBrightness}%) contrast(${totalContrast}%) saturate(${totalSaturate}%) blur(${blurPx}px)`;
      ctx.drawImage(img, -srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);
      ctx.filter = 'none';

      // 2. Highlights & Shadows adjustment layer
      if (adjustments.highlights && adjustments.highlights !== 0) {
        ctx.save();
        if (adjustments.highlights > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${adjustments.highlights * 0.0025})`;
          ctx.globalCompositeOperation = 'screen';
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.abs(adjustments.highlights) * 0.0025})`;
          ctx.globalCompositeOperation = 'multiply';
        }
        ctx.fillRect(-srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);
        ctx.restore();
      }

      if (adjustments.shadows && adjustments.shadows !== 0) {
        ctx.save();
        if (adjustments.shadows > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${adjustments.shadows * 0.0025})`;
          ctx.globalCompositeOperation = 'soft-light';
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${Math.abs(adjustments.shadows) * 0.0025})`;
          ctx.globalCompositeOperation = 'multiply';
        }
        ctx.fillRect(-srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);
        ctx.restore();
      }

      // 3. Temperature (Warmth) & Tint overlays
      const temp = adjustments.temperature || 0;
      const tint = adjustments.tint || 0;
      if (temp !== 0 || tint !== 0) {
        ctx.save();
        if (temp > 0) {
          // Warm Amber
          ctx.fillStyle = `rgba(255, 160, 20, ${temp * 0.0018})`;
          ctx.fillRect(-srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);
        } else if (temp < 0) {
          // Cool Blue
          ctx.fillStyle = `rgba(20, 140, 255, ${Math.abs(temp) * 0.0018})`;
          ctx.fillRect(-srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);
        }

        if (tint > 0) {
          // Magenta Tint
          ctx.fillStyle = `rgba(255, 20, 200, ${tint * 0.0015})`;
          ctx.fillRect(-srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);
        } else if (tint < 0) {
          // Green Tint
          ctx.fillStyle = `rgba(20, 220, 100, ${Math.abs(tint) * 0.0015})`;
          ctx.fillRect(-srcWidth / 2, -srcHeight / 2, srcWidth, srcHeight);
        }
        ctx.restore();
      }

      // 4. Vignette
      if (adjustments.vignette && adjustments.vignette > 0) {
        const radius = Math.max(targetCanvas.width, targetCanvas.height) * 0.7;
        const gradient = ctx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius);
        const opacity = (adjustments.vignette / 100) * 0.85;
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${opacity})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(-targetCanvas.width, -targetCanvas.height, targetCanvas.width * 2, targetCanvas.height * 2);
      }

      // 5. High-Pass Sharpness Edge Convolution Matrix
      if (adjustments.sharpness && adjustments.sharpness > 0) {
        const factor = (adjustments.sharpness / 100) * 0.6;
        const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
        const data = imageData.data;
        const w = targetCanvas.width;
        const h = targetCanvas.height;
        const copy = new Uint8ClampedArray(data);

        for (let y = 1; y < h - 1; y += 2) {
          for (let x = 1; x < w - 1; x += 2) {
            const idx = (y * w + x) * 4;
            for (let c = 0; c < 3; c++) {
              const current = copy[idx + c];
              const up = copy[((y - 1) * w + x) * 4 + c];
              const down = copy[((y + 1) * w + x) * 4 + c];
              const left = copy[(y * w + (x - 1)) * 4 + c];
              const right = copy[(y * w + (x + 1)) * 4 + c];
              const val = current * (1 + 4 * factor) - (up + down + left + right) * factor;
              data[idx + c] = Math.min(255, Math.max(0, val));
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      ctx.restore();
    };
  }, [photo, rotation, flipH, flipV, adjustments]);

  useEffect(() => {
    if (canvasRef.current) {
      drawToCanvas(canvasRef.current, vm.compareMode);
    }
  }, [photo, drawToCanvas, vm.compareMode]);

  useEffect(() => {
    if (isFullscreenPreview && fullscreenCanvasRef.current) {
      drawToCanvas(fullscreenCanvasRef.current, false);
    }
  }, [isFullscreenPreview, drawToCanvas]);

  // Apply Crop Action
  const handleApplyCrop = () => {
    if (!canvasRef.current || !photo) return;
    const sourceCanvas = canvasRef.current;

    const cropX = Math.round((cropRect.x / 100) * sourceCanvas.width);
    const cropY = Math.round((cropRect.y / 100) * sourceCanvas.height);
    const cropW = Math.round((cropRect.width / 100) * sourceCanvas.width);
    const cropH = Math.round((cropRect.height / 100) * sourceCanvas.height);

    if (cropW <= 10 || cropH <= 10) {
      vm.showToast('Crop region too small');
      return;
    }

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropW;
    cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext('2d');

    if (!cropCtx) return;

    cropCtx.drawImage(
      sourceCanvas,
      cropX, cropY, cropW, cropH,
      0, 0, cropW, cropH
    );

    const croppedDataUrl = cropCanvas.toDataURL('image/png');
    vm.updatePhotoUrl(croppedDataUrl, cropW, cropH);
    setIsCropMode(false);
  };

  // Download Current Image
  const handleDownloadImage = () => {
    vm.openExportModal();
  };

  if (!photo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950/30">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-white">No Image Loaded</h3>
          <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
            Upload an image from your device, drag & drop, or press <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">Ctrl + V</code> to paste from clipboard.
          </p>
        </div>

        <div className="w-full max-w-sm">
          <UploadDropZone onFileSelect={vm.uploadPhoto} />
        </div>
      </div>
    );
  }

  const presetsList: { id: PresetFilter; label: string }[] = [
    { id: 'none', label: 'Normal' },
    { id: 'emerald_glow', label: 'Emerald' },
    { id: 'vivid', label: 'Vivid' },
    { id: 'clarity', label: 'Clarity' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'high_contrast', label: 'High Con' },
    { id: 'b_w', label: 'Mono B&W' },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 pb-8 select-none">
      {/* AI Neural Enhancement Suite Bar */}
      <div className="p-3 rounded-2xl bg-zinc-900 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-2.5 shadow-lg shadow-emerald-950/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 fill-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              AI Enhancement Suite
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Real-ESRGAN / GFPGAN
              </span>
            </h4>
            <p className="text-[10px] text-zinc-400">
              {photo.width} × {photo.height} px • Real Sub-Pixel Neural Restoration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          <button
            onClick={() => vm.openAIEnhanceModal('ai_enhance')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>AI Master</span>
          </button>

          <button
            onClick={() => vm.openAIEnhanceModal('face_enhance')}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
          >
            <span>👤 Face Enhance</span>
          </button>

          <button
            onClick={() => vm.openAIEnhanceModal('upscale_4x')}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
          >
            <span>🚀 4x Upscale</span>
          </button>

          <button
            onClick={() => vm.openAIEnhanceModal('denoise')}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs shrink-0 hover:text-white transition-colors"
          >
            <span>Denoise</span>
          </button>

          <button
            onClick={() => vm.openAIEnhanceModal('sharpen')}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs shrink-0 hover:text-white transition-colors"
          >
            <span>Sharpen</span>
          </button>

          <button
            onClick={() => vm.openAIEnhanceModal('ai_enhance')}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs shrink-0"
          >
            <span>+ More</span>
          </button>
        </div>
      </div>

      {/* Top Preview Canvas Container with Drag / Zoom / Pan / Crop Overlay */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOverCanvas(true);
        }}
        onDragLeave={() => setIsDragOverCanvas(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOverCanvas(false);
          if (e.dataTransfer.files?.[0]) {
            vm.uploadPhoto(e.dataTransfer.files[0]);
          }
        }}
        className={`relative w-full aspect-4/3 rounded-3xl bg-zinc-950 border overflow-hidden flex items-center justify-center shadow-2xl transition-all ${
          isDragOverCanvas
            ? 'border-emerald-400 ring-4 ring-emerald-500/30 bg-emerald-950/20'
            : 'border-emerald-900/40'
        } ${isPanning ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-default'}`}
      >
        {/* Canvas Display */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.15s ease-out'
          }}
          className="w-full h-full flex items-center justify-center p-2"
        >
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Drag & Drop Canvas Overlay Badge */}
        {isDragOverCanvas && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-2 text-emerald-400 z-30">
            <Upload className="w-10 h-10 animate-bounce" />
            <span className="text-sm font-bold">Drop Image to Load into Studio</span>
          </div>
        )}

        {/* Interactive Crop Overlay Box */}
        {isCropMode && (
          <div className="absolute inset-0 bg-black/60 z-20 pointer-events-auto flex items-center justify-center">
            <div
              style={{
                left: `${cropRect.x}%`,
                top: `${cropRect.y}%`,
                width: `${cropRect.width}%`,
                height: `${cropRect.height}%`,
              }}
              className="absolute border-2 border-emerald-400 bg-emerald-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-lg"
            >
              {/* Rule of Thirds Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-emerald-400/30" />
                <div className="border-r border-b border-emerald-400/30" />
                <div className="border-b border-emerald-400/30" />
                <div className="border-r border-b border-emerald-400/30" />
                <div className="border-r border-b border-emerald-400/30" />
                <div className="border-b border-emerald-400/30" />
                <div className="border-r border-emerald-400/30" />
                <div className="border-r border-emerald-400/30" />
                <div />
              </div>

              {/* Resize Corner Handles */}
              <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black" />
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black" />
            </div>
          </div>
        )}

        {/* Compare Mode Indicator */}
        {vm.compareMode && (
          <div className="absolute top-3 left-3 z-20 bg-amber-500/90 text-black px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3 h-3" />
            <span>Viewing Original Raw</span>
          </div>
        )}

        {/* Top Floating Zoom & Pan Info Indicator */}
        {zoom !== 1.0 && (
          <div className="absolute top-3 right-3 z-20 bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5">
            <Move className="w-3 h-3" />
            <span>{(zoom * 100).toFixed(0)}%</span>
            <button
              onClick={handleFitToScreen}
              className="text-zinc-400 hover:text-white underline ml-1 text-[9px]"
            >
              Reset
            </button>
          </div>
        )}

        {/* Bottom Floating Canvas Action Controls Bar */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
          {/* Zoom controls pill */}
          <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-2xl border border-emerald-500/30 text-white shadow-xl">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono w-10 text-center font-bold text-emerald-400">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3 bg-zinc-800 mx-0.5" />
            <button
              onClick={handleFitToScreen}
              className="px-2 py-1 rounded-xl text-[10px] font-mono hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-400"
              title="Fit to Screen"
            >
              Fit
            </button>
          </div>

          {/* Compare & Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onMouseDown={() => vm.setCompareMode(true)}
              onMouseUp={() => vm.setCompareMode(false)}
              onTouchStart={() => vm.setCompareMode(true)}
              onTouchEnd={() => vm.setCompareMode(false)}
              className="px-2.5 py-1.5 rounded-2xl bg-black/80 hover:bg-black text-emerald-400 border border-emerald-500/30 backdrop-blur-md text-[11px] font-bold flex items-center gap-1.5 transition-colors select-none"
              title="Press & hold to compare original"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Hold Compare</span>
            </button>

            <button
              onClick={() => setIsFullscreenPreview(true)}
              className="p-2 rounded-2xl bg-black/80 hover:bg-black text-emerald-400 border border-emerald-500/30 backdrop-blur-md text-xs font-bold transition-colors"
              title="Fullscreen Preview"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadImage}
              className="p-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg"
              title="Download Image"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editing Toolbar Category Selector Tabs */}
      <div className="flex items-center justify-around bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 text-xs">
        <button
          onClick={() => setActiveToolTab('transform')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeToolTab === 'transform'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Transform</span>
        </button>

        <button
          onClick={() => setActiveToolTab('adjust')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeToolTab === 'adjust'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Adjust</span>
        </button>

        <button
          onClick={() => setActiveToolTab('presets')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeToolTab === 'presets'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>

        <button
          onClick={() => setActiveToolTab('upload')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeToolTab === 'upload'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* Active Tab Panel Content */}
      <div className="min-h-[160px]">
        {/* Tab 1: Transform & Spatial Controls (Rotate, Flip, Crop) */}
        {activeToolTab === 'transform' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-emerald-400" /> Spatial Controls
              </span>
              <button
                onClick={handleResetAll}
                className="text-[11px] text-zinc-400 hover:text-emerald-400 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Reset All
              </button>
            </div>

            {/* Rotate & Flip Buttons Grid */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleRotateLeft}
                className="py-2.5 px-2 rounded-xl bg-black/60 hover:bg-emerald-500/20 hover:text-emerald-400 border border-zinc-800 text-zinc-300 flex flex-col items-center justify-center gap-1 transition-all"
                title="Rotate 90° Left"
              >
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold">Rotate Left</span>
              </button>

              <button
                onClick={handleRotateRight}
                className="py-2.5 px-2 rounded-xl bg-black/60 hover:bg-emerald-500/20 hover:text-emerald-400 border border-zinc-800 text-zinc-300 flex flex-col items-center justify-center gap-1 transition-all"
                title="Rotate 90° Right"
              >
                <RotateCw className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold">Rotate Right</span>
              </button>

              <button
                onClick={handleToggleFlipH}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  flipH
                    ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                    : 'bg-black/60 hover:bg-emerald-500/20 text-zinc-300 border-zinc-800'
                }`}
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-4 h-4" />
                <span className="text-[10px]">Flip Horiz</span>
              </button>

              <button
                onClick={handleToggleFlipV}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  flipV
                    ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                    : 'bg-black/60 hover:bg-emerald-500/20 text-zinc-300 border-zinc-800'
                }`}
                title="Flip Vertical"
              >
                <FlipVertical className="w-4 h-4" />
                <span className="text-[10px]">Flip Vert</span>
              </button>
            </div>

            {/* Crop Control Section */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsCropMode((prev) => !prev)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                    isCropMode
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                      : 'bg-black/60 text-zinc-300 border-zinc-800 hover:border-emerald-500/40'
                  }`}
                >
                  <CropIcon className="w-4 h-4" />
                  <span>{isCropMode ? 'Crop Mode Active' : 'Enable Interactive Crop'}</span>
                </button>

                {isCropMode && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleApplyCrop}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-1 shadow-md"
                    >
                      <Check className="w-3.5 h-3.5" /> Apply
                    </button>
                    <button
                      onClick={() => setIsCropMode(false)}
                      className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Aspect Ratio Presets when crop mode is active */}
              {isCropMode && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
                  {['free', '1:1', '4:3', '16:9', '9:16', '3:2'].map((aspect) => (
                    <button
                      key={aspect}
                      onClick={() => handleAspectChange(aspect)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                        selectedAspect === aspect
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : 'bg-black/40 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {aspect.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 2: Adjustments Sliders */}
        {activeToolTab === 'adjust' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 shadow-xl"
          >
            {/* Header with Undo, Redo, Reset */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <span className="font-extrabold text-xs text-white flex items-center gap-1.5 uppercase tracking-wide">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Pro Adjustments
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={vm.undo}
                  disabled={!vm.canUndo}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    vm.canUndo
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 active:scale-95'
                      : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-850'
                  }`}
                  title="Undo last change"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>

                <button
                  onClick={vm.redo}
                  disabled={!vm.canRedo}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    vm.canRedo
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 active:scale-95'
                      : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-850'
                  }`}
                  title="Redo change"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                  <span>Redo</span>
                </button>

                <button
                  onClick={vm.resetAdjustments}
                  className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 text-zinc-400 border border-zinc-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Reset all adjustments"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Light Controls Section */}
            <div className="space-y-2.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90 flex items-center gap-1">
                <Sun className="w-3 h-3" /> Light & Tone
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Brightness */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Sun className="w-3 h-3 text-emerald-400" /> Brightness
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.brightness}
                    onChange={(e) => vm.updateAdjustment('brightness', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Contrast className="w-3 h-3 text-emerald-400" /> Contrast
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.contrast}
                    onChange={(e) => vm.updateAdjustment('contrast', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Exposure */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Zap className="w-3 h-3 text-emerald-400" /> Exposure
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.exposure}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.exposure}
                    onChange={(e) => vm.updateAdjustment('exposure', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Highlights */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Sun className="w-3 h-3 text-amber-300" /> Highlights
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.highlights}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.highlights}
                    onChange={(e) => vm.updateAdjustment('highlights', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Shadows */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850 sm:col-span-2">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Moon className="w-3 h-3 text-indigo-400" /> Shadows
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.shadows}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.shadows}
                    onChange={(e) => vm.updateAdjustment('shadows', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Color Controls Section */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-800/80">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90 flex items-center gap-1">
                <Palette className="w-3 h-3" /> Color & White Balance
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Saturation */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Aperture className="w-3 h-3 text-emerald-400" /> Saturation
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.saturation}
                    onChange={(e) => vm.updateAdjustment('saturation', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Thermometer className="w-3 h-3 text-orange-400" /> Temperature
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.temperature}
                    onChange={(e) => vm.updateAdjustment('temperature', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Tint */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Flame className="w-3 h-3 text-pink-400" /> Tint
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.tint}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.tint}
                    onChange={(e) => vm.updateAdjustment('tint', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Details & FX Section */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-800/80">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400/90 flex items-center gap-1">
                <Focus className="w-3 h-3" /> Sharpness & Blur FX
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Sharpness */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Zap className="w-3 h-3 text-emerald-400" /> Sharpness
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.sharpness}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={adjustments.sharpness}
                    onChange={(e) => vm.updateAdjustment('sharpness', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Blur */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Volume2 className="w-3 h-3 text-cyan-400" /> Blur
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.blur}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={adjustments.blur}
                    onChange={(e) => vm.updateAdjustment('blur', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Vignette */}
                <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-850">
                  <div className="flex justify-between text-zinc-300 text-[11px] font-medium">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Focus className="w-3 h-3 text-purple-400" /> Vignette
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{adjustments.vignette}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={adjustments.vignette}
                    onChange={(e) => vm.updateAdjustment('vignette', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Presets */}
        {activeToolTab === 'presets' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-emerald-400" /> Filter Presets
              </span>
              <span className="font-mono text-[10px] text-emerald-400 uppercase font-semibold">
                {vm.presetFilter}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {presetsList.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => vm.applyPreset(preset.id)}
                  className={`p-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all border ${
                    vm.presetFilter === preset.id
                      ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-md'
                      : 'bg-black/60 text-zinc-300 border-zinc-800 hover:border-emerald-500/40'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 4: Upload & Drag Drop Zone */}
        {activeToolTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <UploadDropZone onFileSelect={vm.uploadPhoto} />
          </motion.div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={vm.savePhotoToGallery}
        className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-transform active:scale-95"
      >
        <Save className="w-4 h-4" />
        <span>Save Photo Adjustments</span>
      </button>

      {/* Fullscreen Preview Lightbox Modal */}
      <AnimatePresence>
        {isFullscreenPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col p-4 select-none"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white p-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">{photo.title}</span>
                <span className="text-xs font-mono text-zinc-400">
                  ({photo.width} × {photo.height})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadImage}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => setIsFullscreenPreview(false)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Canvas */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
              <canvas
                ref={fullscreenCanvasRef}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
