import React from "react";
import {
  Home,
  Image,
  Images,
  Settings,
  History,
  X,
} from "lucide-react";
import { NavigationTab } from "../types";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenHistory: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onOpenHistory,
}) => {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "studio", label: "AI Studio", icon: Image },
    { id: "gallery", label: "Gallery", icon: Images },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-72 bg-[#12061f] border-r border-violet-700/40 shadow-2xl z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-violet-700/30">
          <div>
            <h2 className="text-white text-lg font-bold">
              JS AI Assistant
            </h2>
            <p className="text-violet-300 text-xs">
              Powered by JS AI
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-violet-600/20"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id as NavigationTab);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === item.id
                    ? "bg-violet-600 text-white"
                    : "text-zinc-300 hover:bg-violet-700/20"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              onOpenHistory();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-violet-700/20 transition"
          >
            <History className="w-5 h-5" />
            <span>Recent Projects</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-violet-700/30">
          <p className="text-center text-xs text-violet-300">
            JS AI Assistant v1.0
          </p>
        </div>
      </div>
    </>
  );
};