import React, { useMemo, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { AppViewModel } from "../viewmodel/useAppViewModel";
import { JSLogo } from "./JSLogo";

interface TopAppBarProps {
  vm: AppViewModel;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ vm }) => {
  const [search, setSearch] = useState("");

  const getTitle = () => {
    switch (vm.activeTab) {
      case "home":
        return "JS AI Assistant";
      case "studio":
        return "AI Image Studio";
      case "gallery":
        return "AI Gallery";
      case "settings":
        return "AI Settings";
      case "chat":
        return "AI Chat";
      default:
        return "JS AI Assistant";
    }
  };

  const searchItems = [
    {
      title: "Home",
      keywords: ["home"],
      action: () => vm.setActiveTab("home"),
    },
    {
      title: "AI Chat",
      keywords: ["chat", "assistant", "gemini"],
      action: () => vm.setActiveTab("chat"),
    },
    {
      title: "Image Studio",
      keywords: ["studio", "photo", "image"],
      action: () => vm.setActiveTab("studio"),
    },
    {
      title: "Gallery",
      keywords: ["gallery", "photos"],
      action: () => vm.setActiveTab("gallery"),
    },
    {
      title: "Settings",
      keywords: ["settings"],
      action: () => vm.setActiveTab("settings"),
    },
    {
      title: "AI Video",
      keywords: ["video"],
      action: () => vm.showToast("Coming Soon"),
    },
    {
      title: "AI Music",
      keywords: ["music"],
      action: () => vm.showToast("Coming Soon"),
    },
    {
      title: "AI Translator",
      keywords: ["translator"],
      action: () => vm.showToast("Coming Soon"),
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
    <>
      <header
        className="
        sticky
        top-0
        z-30
        bg-gradient-to-r
        from-[#13051F]
        via-[#1B0830]
        to-[#2A0A45]
        backdrop-blur-xl
        border-b
        border-violet-700/40
        px-4
        py-3
        shadow-xl
        "
      >
        <div className="flex items-center gap-3">

          <button
            onClick={vm.toggleSideMenu}
            className="
            p-2
            rounded-xl
            hover:bg-white/10
            transition
            "
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <JSLogo
            size="sm"
            showText={false}
          />

          <div>

            <h1 className="text-sm font-black text-white">
              {getTitle()}
            </h1>

            <p className="text-[10px] text-violet-300">
              Powered by JS AI
            </p>

          </div>

          <div className="flex-1" />

          <div className="relative w-full max-w-sm hidden md:block">

            <Search
              className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              w-4
              h-4
              text-zinc-500
              "
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search AI..."
              className="
              w-full
              rounded-xl
              border
              border-violet-500/30
              bg-zinc-950/80
              pl-10
              pr-4
              py-2
              text-sm
              text-white
              outline-none
              "
            />

            {filteredItems.length > 0 && (
              <div
                className="
                absolute
                top-12
                left-0
                w-full
                rounded-xl
                overflow-hidden
                bg-zinc-950
                border
                border-violet-500/30
                shadow-2xl
                z-50
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
                    text-left
                    px-4
                    py-3
                    hover:bg-violet-500/20
                    text-white
                    "
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </header>
            {vm.sideMenuOpen && (
        <>
          {/* Background Overlay */}
          <div
            onClick={vm.toggleSideMenu}
            className="
            fixed
            inset-0
            bg-black/50
            backdrop-blur-sm
            z-40
            "
          />

          {/* ChatGPT Style Sidebar */}
          <aside
            className="
            fixed
            top-0
            left-0
            h-full
            w-72
            bg-[#0f0f12]
            border-r
            border-violet-500/20
            shadow-2xl
            z-50
            flex
            flex-col
            "
          >
            {/* Header */}
            <div
              className="
              flex
              items-center
              justify-between
              px-5
              py-5
              border-b
              border-violet-500/20
              "
            >
              <div className="flex items-center gap-3">
                <JSLogo size="sm" showText={false} />

                <div>
                  <h2 className="font-bold text-white">
                    JS AI Hub
                  </h2>

                  <p className="text-xs text-violet-300">
                    Premium Workspace
                  </p>
                </div>
              </div>

              <button
                onClick={vm.toggleSideMenu}
                className="
                p-2
                rounded-lg
                hover:bg-white/10
                transition
                "
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Menu */}
            <div className="flex-1 py-3">

              <button
                onClick={() => {
                  vm.setActiveTab("home");
                  vm.toggleSideMenu();
                }}
                className="
                w-full
                px-6
                py-4
                text-left
                text-white
                hover:bg-violet-500/20
                transition
                "
              >
                🏠 Home
              </button>

              <button
                onClick={() => {
                  vm.setActiveTab("chat");
                  vm.toggleSideMenu();
                }}
                className="
                w-full
                px-6
                py-4
                text-left
                text-white
                hover:bg-violet-500/20
                transition
                "
              >
                🤖 AI Chat
              </button>

              <button
                onClick={() => {
                  vm.setActiveTab("studio");
                  vm.toggleSideMenu();
                }}
                className="
                w-full
                px-6
                py-4
                text-left
                text-white
                hover:bg-violet-500/20
                transition
                "
              >
                🖼 Image Studio
              </button>

              <button
                onClick={() => {
                  vm.openRecentProjectsModal();
                  vm.toggleSideMenu();
                }}
                className="
                w-full
                px-6
                py-4
                text-left
                text-white
                hover:bg-violet-500/20
                transition
                "
              >
                📜 History
              </button>

              <button
                onClick={() => {
                  vm.setActiveTab("settings");
                  vm.toggleSideMenu();
                }}
                className="
                w-full
                px-6
                py-4
                text-left
                text-white
                hover:bg-violet-500/20
                transition
                "
              >
                ⚙️ Settings
              </button>

            </div>

            {/* Bottom */}
            <div
              className="
              border-t
              border-violet-500/20
              p-5
              "
            >
              <div className="text-xs text-zinc-400">
                JS AI Assistant v1.0
              </div>

              <div className="text-[11px] text-violet-300 mt-1">
                Powered by JS AI Hub
              </div>
            </div>

          </aside>
        </>
      )}
    </>
  );
};
