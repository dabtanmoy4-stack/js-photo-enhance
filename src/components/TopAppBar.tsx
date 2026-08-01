import React from 'react';
import { AppViewModel } from '../viewmodel/useAppViewModel';
import { JSLogo } from './JSLogo';
import { Smartphone, Monitor, RotateCcw, Plus, Sparkles, Download, History } from 'lucide-react';

interface TopAppBarProps {
  vm: AppViewModel;
  onOpenUploadModal?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ vm, onOpenUploadModal }) => {
  const getTitle = () => {
    switch (vm.activeTab) {
      case 'home':
        return 'JS Home Dashboard';
      case 'studio':
        return 'Photo Enhance Studio';
      case 'gallery':
        return 'Enhancement Gallery';
      case 'settings':
        return 'App Settings & Architecture';
      default:
        return 'JS Photo Enhance';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-emerald-900/40 text-white px-4 py-3 transition-all duration-200">
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Left: JS Logo & Title */}
        <div className="flex items-center gap-3">
          <JSLogo size="sm" showText={false} />
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{getTitle()}</span>
              {vm.activeTab === 'studio' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-2.5 h-2.5" /> LIVE
                </span>
              )}
            </h1>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline-block">
              com.js.photoenhance • Compose M3
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* History / Recent Projects Modal */}
          <button
            onClick={vm.openRecentProjectsModal}
            title="Recent Projects & History"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 transition-colors flex items-center gap-1"
          >
            <History className="w-4 h-4" />
            {vm.projectHistory.length > 0 && (
              <span className="text-[10px] font-bold text-emerald-400 font-mono">
                {vm.projectHistory.length}
              </span>
            )}
          </button>

          {/* Export Button (Studio Tab or Selected Photo) */}
          {vm.selectedPhoto && (
            <button
              onClick={vm.openExportModal}
              title="Export & Download Enhanced Photo"
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">Export</span>
            </button>
          )}

          {/* Replay Splash Button */}
          <button
            onClick={vm.replaySplash}
            title="Replay Splash Screen"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Device Frame vs Fullscreen Toggle */}
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => vm.setDisplayMode('device')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                vm.displayMode === 'device'
                  ? 'bg-emerald-500 text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Android Mobile Frame Mode"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Device</span>
            </button>
            <button
              onClick={() => vm.setDisplayMode('fullscreen')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                vm.displayMode === 'fullscreen'
                  ? 'bg-emerald-500 text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Full Window Mode"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full</span>
            </button>
          </div>

          {/* Quick Action: Import Photo */}
          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold text-xs shadow-md shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95">
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Import</span>
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

