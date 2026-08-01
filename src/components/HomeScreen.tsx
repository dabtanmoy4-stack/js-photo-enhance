import React from 'react';
import { AppViewModel } from '../viewmodel/useAppViewModel';
import { motion } from 'motion/react';
import { JSLogo } from './JSLogo';
import { UploadDropZone } from './UploadDropZone';
import { 
  Sparkles, 
  Upload, 
  Sliders, 
  Image as ImageIcon, 
  Wand2, 
  Layers, 
  ChevronRight, 
  Zap, 
  ShieldCheck,
  CheckCircle2,
  History,
  Download
} from 'lucide-react';

interface HomeScreenProps {
  vm: AppViewModel;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ vm }) => {
  return (
    <div className="flex-1 p-4 sm:p-5 space-y-5 pb-8">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-5 border border-emerald-500/30 shadow-xl shadow-emerald-950/20"
      >
        {/* Background Accent Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <JSLogo size="md" />
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> Ready
            </span>
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Enhance Photos with Precision
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Material 3 Jetpack Compose UI architecture. Rotate, flip, crop, zoom, pan, adjust brightness, contrast, vignette, export formats (PNG, JPG, WEBP) & project history.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => vm.openAIEnhanceModal('ai_enhance')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Launch AI Enhancement</span>
            </button>

            <button
              onClick={vm.openRecentProjectsModal}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition-colors"
            >
              <History className="w-4 h-4 text-emerald-400" />
              <span>History ({vm.projectHistory.length})</span>
            </button>

            <label className="cursor-pointer flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition-colors">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Import</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    vm.uploadPhoto(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </motion.div>

      {/* AI Enhancement Quick Modes Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI Neural Enhancement Engine
          </span>
          <button
            onClick={() => vm.openAIEnhanceModal('ai_enhance')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            <span>All 10 AI Modes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => vm.openAIEnhanceModal('face_enhance')}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">Face Enhance</div>
            <div className="text-[10px] text-zinc-400">GFPGAN v1.4</div>
          </button>

          <button
            onClick={() => vm.openAIEnhanceModal('upscale_4x')}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">4x Upscale</div>
            <div className="text-[10px] text-zinc-400">Real-ESRGAN</div>
          </button>

          <button
            onClick={() => vm.openAIEnhanceModal('denoise')}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              <Wand2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">AI Denoise</div>
            <div className="text-[10px] text-zinc-400">Bilateral Filter</div>
          </button>

          <button
            onClick={() => vm.openAIEnhanceModal('sharpen')}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">AI Sharpen</div>
            <div className="text-[10px] text-zinc-400">Unsharp Mask</div>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <UploadDropZone onFileSelect={vm.uploadPhoto} />

      {/* Recent Projects History Banner (If items exist) */}
      {vm.projectHistory.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Saved Projects</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                {vm.projectHistory.length}
              </span>
            </div>
            <button
              onClick={vm.openRecentProjectsModal}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>Manage History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {vm.projectHistory.slice(0, 6).map((proj) => (
              <motion.div
                key={proj.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => vm.selectHistoryProject(proj)}
                className="relative flex-shrink-0 w-36 h-44 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500 cursor-pointer group bg-black"
              >
                <img
                  src={proj.thumbnailUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                    {proj.format.toUpperCase()}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                  <span className="text-xs font-bold text-white truncate">{proj.title}</span>
                  <span className="text-[10px] text-zinc-400">{proj.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Export Modal Direct Launcher */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (vm.selectedPhoto) {
              vm.openExportModal();
            } else {
              vm.showToast('Please import or select a photo first');
            }
          }}
          className="cursor-pointer p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Export & Quality
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              PNG, JPG, WEBP, Custom Resolution
            </p>
          </div>
        </motion.div>

        {/* Preset Filters */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            vm.setActiveTab('studio');
            vm.applyPreset('emerald_glow');
          }}
          className="cursor-pointer p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Color Presets
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Vivid, Clarity, B&W, Emerald
            </p>
          </div>
        </motion.div>
      </div>

      {/* Recent Photos / Gallery Preview */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Recent Photos</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 font-mono font-bold">
              {vm.photos.length}
            </span>
          </div>
          <button
            onClick={() => vm.setActiveTab('gallery')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Photo Slider */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {vm.photos.map((photo) => {
            const isSelected = vm.selectedPhoto?.id === photo.id;
            return (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => vm.setSelectedPhoto(photo, true)}
                className={`relative flex-shrink-0 w-36 h-48 rounded-2xl overflow-hidden border cursor-pointer group transition-all ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                  <span className="text-xs font-bold text-white truncate">
                    {photo.title}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {photo.width} × {photo.height}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-black p-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Jetpack Compose Architecture Info */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Production MVVM Architecture</span>
        </div>
        <p className="text-zinc-400 leading-relaxed text-[11px]">
          Clean separation of Concerns: <code className="text-emerald-300">useAppViewModel</code> handles state management, local persistence, high-resolution canvas export, PNG/JPG/WEBP formats, and history tracking.
        </p>
      </div>
    </div>
  );
};
