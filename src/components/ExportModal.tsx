import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Share2, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Lock, 
  Unlock, 
  FileImage, 
  Maximize2,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';
import { PhotoItem, PhotoAdjustments, ExportFormat, ResolutionMode, ExportSettings } from '../types';

interface ExportModalProps {
  photo: PhotoItem;
  adjustments: PhotoAdjustments;
  onClose: () => void;
  onSaveToHistory: (historyRecord: {
    photoId: string;
    title: string;
    thumbnailUrl: string;
    width: number;
    height: number;
    adjustments: PhotoAdjustments;
    format: ExportFormat;
  }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  photo,
  adjustments,
  onClose,
  onSaveToHistory
}) => {
  const [format, setFormat] = useState<ExportFormat>('jpeg');
  const [quality, setQuality] = useState<number>(0.92);
  const [resolutionMode, setResolutionMode] = useState<ResolutionMode>('original');
  const [customWidth, setCustomWidth] = useState<number>(photo.width || 1920);
  const [customHeight, setCustomHeight] = useState<number>(photo.height || 1080);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>(
    `${photo.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_enhanced`
  );

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [exportedUrl, setExportedUrl] = useState<string>('');
  const [estimatedSizeKb, setEstimatedSizeKb] = useState<number>(photo.sizeKb || 1200);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const aspectRatio = (photo.width || 1920) / (photo.height || 1080);

  // Compute actual dimensions based on selected resolution mode
  const getExportDimensions = (): { width: number; height: number } => {
    switch (resolutionMode) {
      case '2x':
        return { width: Math.round(photo.width * 2), height: Math.round(photo.height * 2) };
      case '4x':
        return { width: Math.round(photo.width * 4), height: Math.round(photo.height * 4) };
      case 'custom':
        return { width: Math.max(10, customWidth), height: Math.max(10, customHeight) };
      case 'original':
      default:
        return { width: photo.width, height: photo.height };
    }
  };

  const { width: finalWidth, height: finalHeight } = getExportDimensions();

  // Estimate output file size based on resolution, quality, and format
  useEffect(() => {
    const pixelRatio = (finalWidth * finalHeight) / (photo.width * photo.height);
    let formatMultiplier = 1.0;
    if (format === 'png') formatMultiplier = 2.4;
    if (format === 'webp') formatMultiplier = 0.75;
    if (format === 'jpeg') formatMultiplier = 0.9 * quality;

    const estimated = Math.round(photo.sizeKb * pixelRatio * formatMultiplier);
    setEstimatedSizeKb(Math.max(20, estimated));
  }, [finalWidth, finalHeight, format, quality, photo]);

  const handleWidthChange = (newWidth: number) => {
    setCustomWidth(newWidth);
    if (keepAspectRatio && aspectRatio > 0) {
      setCustomHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setCustomHeight(newHeight);
    if (keepAspectRatio && aspectRatio > 0) {
      setCustomWidth(Math.round(newHeight * aspectRatio));
    }
  };

  // Render photo on high-res canvas and export
  const renderCanvasAndExport = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get 2D context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 1. Base adjustments (Brightness, Exposure, Contrast, Saturation, Blur)
        const totalBrightness = 100 + adjustments.brightness + Math.round((adjustments.exposure || 0) * 0.8);
        const totalContrast = 100 + adjustments.contrast;
        const totalSaturate = 100 + adjustments.saturation;
        const blurPx = Math.round((adjustments.blur || 0) * (finalWidth / 1000));

        ctx.filter = `brightness(${totalBrightness}%) contrast(${totalContrast}%) saturate(${totalSaturate}%) blur(${blurPx}px)`;
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        ctx.filter = 'none';

        // 2. Highlights & Shadows
        if (adjustments.highlights && adjustments.highlights !== 0) {
          ctx.save();
          if (adjustments.highlights > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${adjustments.highlights * 0.0025})`;
            ctx.globalCompositeOperation = 'screen';
          } else {
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.abs(adjustments.highlights) * 0.0025})`;
            ctx.globalCompositeOperation = 'multiply';
          }
          ctx.fillRect(0, 0, finalWidth, finalHeight);
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
          ctx.fillRect(0, 0, finalWidth, finalHeight);
          ctx.restore();
        }

        // 3. Temperature & Tint
        const temp = adjustments.temperature || 0;
        const tint = adjustments.tint || 0;
        if (temp !== 0 || tint !== 0) {
          ctx.save();
          if (temp > 0) {
            ctx.fillStyle = `rgba(255, 160, 20, ${temp * 0.0018})`;
            ctx.fillRect(0, 0, finalWidth, finalHeight);
          } else if (temp < 0) {
            ctx.fillStyle = `rgba(20, 140, 255, ${Math.abs(temp) * 0.0018})`;
            ctx.fillRect(0, 0, finalWidth, finalHeight);
          }

          if (tint > 0) {
            ctx.fillStyle = `rgba(255, 20, 200, ${tint * 0.0015})`;
            ctx.fillRect(0, 0, finalWidth, finalHeight);
          } else if (tint < 0) {
            ctx.fillStyle = `rgba(20, 220, 100, ${Math.abs(tint) * 0.0015})`;
            ctx.fillRect(0, 0, finalWidth, finalHeight);
          }
          ctx.restore();
        }

        // 4. Vignette
        if (adjustments.vignette && adjustments.vignette > 0) {
          ctx.save();
          const centerX = finalWidth / 2;
          const centerY = finalHeight / 2;
          const radius = Math.max(finalWidth, finalHeight) * 0.7;
          const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius);
          const opacity = (adjustments.vignette / 100) * 0.85;
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, `rgba(0,0,0,${opacity})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, finalWidth, finalHeight);
          ctx.restore();
        }

        // 5. High-Pass Sharpness
        if (adjustments.sharpness && adjustments.sharpness > 0) {
          const factor = (adjustments.sharpness / 100) * 0.5;
          const imageData = ctx.getImageData(0, 0, finalWidth, finalHeight);
          const data = imageData.data;
          const copy = new Uint8ClampedArray(data);

          for (let y = 1; y < finalHeight - 1; y += 2) {
            for (let x = 1; x < finalWidth - 1; x += 2) {
              const idx = (y * finalWidth + x) * 4;
              for (let c = 0; c < 3; c++) {
                const current = copy[idx + c];
                const up = copy[((y - 1) * finalWidth + x) * 4 + c];
                const down = copy[((y + 1) * finalWidth + x) * 4 + c];
                const left = copy[(y * finalWidth + (x - 1)) * 4 + c];
                const right = copy[(y * finalWidth + (x + 1)) * 4 + c];
                const val = current * (1 + 4 * factor) - (up + down + left + right) * factor;
                data[idx + c] = Math.min(255, Math.max(0, val));
              }
            }
          }
          ctx.putImageData(imageData, 0, 0);
        }

        const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load photo source image'));
      img.src = photo.url;
    });
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await renderCanvasAndExport();
      setExportedUrl(dataUrl);

      // Trigger browser download
      const link = document.createElement('a');
      link.download = `${fileName}.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save to project history
      onSaveToHistory({
        photoId: photo.id,
        title: fileName,
        thumbnailUrl: dataUrl,
        width: finalWidth,
        height: finalHeight,
        adjustments,
        format
      });

      setExportSuccess(true);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await renderCanvasAndExport();
      setExportedUrl(dataUrl);

      // Convert data URL to Blob for Web Share API
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${fileName}.${format}`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Enhanced Photo from JS Photo Studio',
          text: `Check out this enhanced photo rendered with JS Neural Studio!`,
          files: [file]
        });
      } else {
        // Fallback: Copy data URL or blob URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      }

      onSaveToHistory({
        photoId: photo.id,
        title: fileName,
        thumbnailUrl: dataUrl,
        width: finalWidth,
        height: finalHeight,
        adjustments,
        format
      });

      setExportSuccess(true);
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Export & Download</h3>
              <p className="text-[11px] text-zinc-400">High-Resolution Canvas Export Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 scrollbar-none">
          {/* Success Animation Screen */}
          {exportSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  className="w-20 h-20 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30"
                >
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute -top-2 -right-2 text-amber-300"
                >
                  <Sparkles className="w-6 h-6 fill-amber-300" />
                </motion.div>
              </div>

              <div>
                <h4 className="text-lg font-black text-white">Export Complete!</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Saved as <span className="text-emerald-400 font-mono font-bold">{fileName}.{format}</span> ({finalWidth} × {finalHeight} px)
                </p>
              </div>

              {/* Thumbnail Preview */}
              {exportedUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 shadow-xl max-w-xs aspect-video bg-black/50">
                  <img src={exportedUrl} alt="Exported photo" className="w-full h-full object-contain" />
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 w-full">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `${fileName}.${format}`;
                    link.href = exportedUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                >
                  <Download className="w-4 h-4" /> Download Again
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700"
                >
                  Done
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* File Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <FileImage className="w-3.5 h-3.5 text-emerald-400" /> Output File Name
                </label>
                <div className="flex items-center rounded-xl bg-black/50 border border-zinc-800 px-3 py-2 text-xs font-mono">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 bg-transparent text-white focus:outline-none"
                    placeholder="my_photo_enhanced"
                  />
                  <span className="text-zinc-500 font-bold">.{format}</span>
                </div>
              </div>

              {/* Format Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">Image Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['jpeg', 'png', 'webp'] as ExportFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        format === fmt
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold shadow-md shadow-emerald-950/20'
                          : 'bg-black/40 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                      }`}
                    >
                      <div className="text-xs font-black uppercase">{fmt.toUpperCase()}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {fmt === 'png' ? 'Lossless / Transparent' : fmt === 'webp' ? 'Ultra Compact' : 'Universal JPG'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Selector (for JPG / WEBP) */}
              {format !== 'png' && (
                <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-zinc-850">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-300 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Export Quality
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{Math.round(quality * 100)}%</span>
                  </div>

                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <button onClick={() => setQuality(0.3)} className="hover:text-zinc-300">Low (30%)</button>
                    <button onClick={() => setQuality(0.6)} className="hover:text-zinc-300">Medium (60%)</button>
                    <button onClick={() => setQuality(0.85)} className="hover:text-zinc-300">High (85%)</button>
                    <button onClick={() => setQuality(1.0)} className="hover:text-emerald-400 font-bold">Max (100%)</button>
                  </div>
                </div>
              )}

              {/* Resolution Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" /> Resolution Mode
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setResolutionMode('original')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      resolutionMode === 'original'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-extrabold">Original</div>
                    <div className="text-[10px] text-zinc-500">{photo.width} × {photo.height}</div>
                  </button>

                  <button
                    onClick={() => setResolutionMode('2x')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      resolutionMode === '2x'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-extrabold">2x HD</div>
                    <div className="text-[10px] text-zinc-500">{photo.width * 2} × {photo.height * 2}</div>
                  </button>

                  <button
                    onClick={() => setResolutionMode('4x')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      resolutionMode === '4x'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-extrabold">4x Ultra HD</div>
                    <div className="text-[10px] text-zinc-500">{photo.width * 4} × {photo.height * 4}</div>
                  </button>

                  <button
                    onClick={() => setResolutionMode('custom')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      resolutionMode === 'custom'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-extrabold">Custom</div>
                    <div className="text-[10px] text-zinc-500">Specify px</div>
                  </button>
                </div>

                {/* Custom Resolution Inputs */}
                {resolutionMode === 'custom' && (
                  <div className="pt-2 p-3 rounded-2xl bg-black/40 border border-zinc-850 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                      <span>Custom Dimensions</span>
                      <button
                        onClick={() => setKeepAspectRatio(!keepAspectRatio)}
                        className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border ${
                          keepAspectRatio
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {keepAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        <span>Lock Aspect Ratio</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Width (px)</label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-0.5">Height (px)</label>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-white focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Stats Box */}
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-between text-xs">
                <div>
                  <div className="text-zinc-400 text-[11px]">Output Resolution</div>
                  <div className="font-mono font-bold text-white">{finalWidth} × {finalHeight} px</div>
                </div>

                <div>
                  <div className="text-zinc-400 text-[11px]">Est. File Size</div>
                  <div className="font-mono font-bold text-emerald-400">
                    {estimatedSizeKb > 1024 ? `${(estimatedSizeKb / 1024).toFixed(2)} MB` : `${estimatedSizeKb} KB`}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!exportSuccess && (
          <div className="pt-4 border-t border-zinc-800 flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Rendering...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              disabled={isExporting}
              className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              title="Share or Copy Link"
            >
              {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copySuccess ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
