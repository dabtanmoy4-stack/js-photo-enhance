import React from 'react';
import { AppViewModel } from '../viewmodel/useAppViewModel';
import { JSLogo } from './JSLogo';
import {
  Smartphone,
  Monitor,
  RotateCcw,
  Plus,
  Sparkles,
  Download,
  History,
} from 'lucide-react';

interface TopAppBarProps {
  vm: AppViewModel;
  onOpenUploadModal?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ vm }) => {
  const getTitle = () => {
    switch (vm.activeTab) {
      case 'home':
        return 'JS AI Assistant';

      case 'studio':
        return 'AI Image Studio';

      case 'gallery':
        return 'AI Gallery';

      case 'settings':
        return 'AI Settings';

      default:
        return 'JS AI Assistant';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#13051F] via-[#1B0830] to-[#2A0A45] backdrop-blur-xl border-b border-violet-700/40 text-white px-4 py-3 shadow-lg shadow-violet-950/40">
      <div className="flex items-center justify-between gap-2 max-w-6xl mx-auto">

        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <JSLogo size="sm" showText={false} />

          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>{getTitle()}</span>
                            {vm.activeTab === 'studio' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow shadow-violet-900/30">
                  <Sparkles className="w-3 h-3" />
                  LIVE AI
                </span>
              )}
            </h1>

            <span className="text-[10px] text-violet-300/80 font-mono hidden sm:inline-block tracking-wider">
              com.js.aiassistant • Powered by Gemini AI
            </span>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">

          {/* History */}
          <button
            onClick={vm.openRecentProjectsModal}
            title="Recent Projects"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-violet-900/40 text-zinc-300 hover:text-violet-300 border border-zinc-800 transition-all duration-200"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Export */}
          {vm.selectedPhoto && (
            <button
              onClick={vm.openExportModal}
              title="Export Image"
              className="p-2 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 border border-violet-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">Export</span>
            </button>
          )}

          {/* Replay Splash */}
          <button
            onClick={vm.replaySplash}
            title="Replay Splash"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-violet-900/40 text-zinc-300 hover:text-violet-300 border border-zinc-800 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
                    {/* Device / Fullscreen Toggle */}
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-zinc-900 border border-zinc-800">

            <button
              onClick={() => vm.setDisplayMode('device')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                vm.displayMode === 'device'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                  : 'text-zinc-400 hover:text-violet-300'
              }`}
              title="Android Device Mode"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Device</span>
            </button>

            <button
              onClick={() => vm.setDisplayMode('fullscreen')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                vm.displayMode === 'fullscreen'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                  : 'text-zinc-400 hover:text-violet-300'
              }`}
              title="Fullscreen Mode"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full</span>
            </button>

          </div>

          {/* Upload Image Button */}
          <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-lg shadow-violet-900/40 transition-all duration-200 hover:scale-105 active:scale-95">

            <Plus className="w-4 h-4" />

            <span className="hidden xs:inline">
              Upload
            </span>

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
    </header>
  );
};