import React from 'react';
import { AppViewModel } from '../viewmodel/useAppViewModel';
import { JSLogo } from './JSLogo';
import {
  Plus,
  Download,
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

        {/* Left Side */}
<div className="flex items-center gap-3">

  {/* Hamburger Menu */}
  <button
    onClick={vm.toggleSideMenu}
    className="p-2 rounded-xl hover:bg-violet-500/10 transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  <JSLogo size="sm" showText={false} />

  <div>
    <h1 className="text-sm font-black text-white">
      {getTitle()}
    </h1>

    <span className="text-[10px] text-violet-300 hidden sm:block">
      Powered by JS AI
    </span>
  </div>

</div>
         
        

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">

      
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