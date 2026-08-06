import React, { useMemo, useState } from 'react';
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
// ================= SEARCH =================

const [search, setSearch] = useState("");

const searchItems = [
  {
    title: "Image Studio",
    keywords: ["image", "photo", "studio", "enhance"],
    action: () => vm.setActiveTab("studio"),
  },
  {
    title: "Gallery",
    keywords: ["gallery", "photos", "images"],
    action: () => vm.setActiveTab("gallery"),
  },
  {
    title: "Settings",
    keywords: ["settings", "config", "preferences"],
    action: () => vm.setActiveTab("settings"),
  },
  {
    title: "Home",
    keywords: ["home", "main"],
    action: () => vm.setActiveTab("home"),
  },
  {
    title: "AI Chat",
    keywords: ["chat", "assistant", "gemini"],
    action: () => vm.showToast("AI Chat - Coming Soon"),
  },
  {
    title: "AI Writer",
    keywords: ["writer", "write", "text"],
    action: () => vm.showToast("JS AI Writer - Coming Soon"),
  },
  
  {
    title: "AI Video",
    keywords: ["video", "movie"],
    action: () => vm.showToast("JS AI Video - Coming Soon"),
  },
  
{
  title: "JS AI App Builder",
  keywords: ["app", "app making", "android", "apk", "application"],
  action: () => vm.showToast("JS AI App Builder - Coming Soon"),
},
{
  title: "JS AI Song Maker",
  keywords: ["song", "music", "audio", "lyrics"],
  action: () => vm.showToast("JS AI Song Maker - Coming Soon"),
},
{
  title: "JS AI Image Generator",
  keywords: ["image", "photo", "art", "generate"],
  action: () => vm.showToast("JS AI Image Generator - Coming Soon"),
},
{
  title: "JS AI Video Generator",
  keywords: ["video", "movie", "clip"],
  action: () => vm.showToast("JS AI Video Generator - Coming Soon"),
},
{
  title: "JS AI Code",
  keywords: ["code", "coding", "programming", "developer"],
  action: () => vm.showToast("JS AI Code - Coming Soon"),
},
{
  title: "JS AI Translator",
  keywords: ["translator", "translate", "language"],
  action: () => vm.showToast("JS AI Translator - Coming Soon"),
},
];

const filteredItems = useMemo(() => {
  if (!search.trim()) return [];

  const q = search.toLowerCase();

  return searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q))
  );
}, [search]);

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
 {/* ================= SEARCH BOX ================= */}

<div className="w-full max-w-md"

  <div className="relative w-full max-w-sm">

    {/* Animated Border */}
    <div className="absolute -inset-[2px] rounded-xl overflow-hidden">
      <div className="ai-search-border"></div>
    </div>


    {/* Input */}
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search AI tools..."
      className="
      relative
      z-10
      w-full
      rounded-xl
      bg-zinc-950/90
      px-4
      py-2
      text-sm
      text-white
      placeholder:text-zinc-500
      outline-none
      "
    />


    {/* Search Result */}

    {filteredItems.length > 0 && (
      <div
        className="
        absolute
        right-0
        top-14
        z-50
        w-full
        overflow-hidden
        rounded-xl
        border
        border-violet-500/30
        bg-zinc-950
        shadow-2xl
        "
      >

        {filteredItems.map((item) => (
          <button
            key={item.title}
            onClick={() => {
              item.action();
              setSearch("");
            }}
            className="
            block
            w-full
            border-b
            border-zinc-800
            px-4
            py-3
            text-left
            text-sm
            text-white
            hover:bg-violet-600/20
            transition
            last:border-none
            "
          >
            {item.title}
          </button>
        ))}

      </div>
    )}

  </div>

</div>

      </div>
    </header>
  );
};