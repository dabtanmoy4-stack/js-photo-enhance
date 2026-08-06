import React from 'react';
import { AppViewModel } from '../viewmodel/useAppViewModel';
import { JSLogo } from './JSLogo';

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

      </div>
    </header>
  );
};