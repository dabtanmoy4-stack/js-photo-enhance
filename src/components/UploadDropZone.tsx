import React, { useState, useCallback } from 'react';
import { Upload, Clipboard, Sparkles, Image as ImageIcon } from 'lucide-react';

interface UploadDropZoneProps {
  onFileSelect: (file: File) => void;
  compact?: boolean;
}

export const UploadDropZone: React.FC<UploadDropZoneProps> = ({ onFileSelect, compact = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  if (compact) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-3 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]'
            : 'border-zinc-800 bg-zinc-900/60 hover:border-emerald-500/40 hover:bg-zinc-900'
        }`}
      >
        <label className="cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-zinc-300">
          <Upload className="w-4 h-4 text-emerald-400" />
          <span>{isDragOver ? 'Drop Image Here!' : 'Drag & Drop or Click to Upload'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onFileSelect(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-3xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer overflow-hidden ${
        isDragOver
          ? 'border-emerald-400 bg-emerald-500/15 ring-4 ring-emerald-500/20 scale-[1.01]'
          : 'border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/50 hover:bg-zinc-900/80'
      }`}
    >
      <label className="cursor-pointer flex flex-col items-center justify-center space-y-3">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Upload className="w-7 h-7" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-black">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-white">
            {isDragOver ? 'Release to Load Photo' : 'Drag & Drop Image Here'}
          </p>
          <p className="text-xs text-zinc-400">
            or <span className="text-emerald-400 underline font-semibold">browse files</span> from your device
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-mono border border-zinc-700">
            <Clipboard className="w-3 h-3 text-emerald-400" /> Ctrl + V to Paste
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-mono border border-zinc-700">
            JPG, PNG, WEBP, GIF
          </span>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onFileSelect(e.target.files[0]);
            }
          }}
        />
      </label>
    </div>
  );
};
