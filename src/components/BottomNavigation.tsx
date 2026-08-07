import React from "react";
import { NavigationTab } from "../types";
import { Home, History, Settings } from "lucide-react";
import { motion } from "motion/react";

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: "home" as NavigationTab,
      label: "Home",
      icon: Home,
    },
    {
      id: "settings" as NavigationTab,
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-black border-r border-violet-900/40 p-4 flex flex-col">
      <h2 className="text-xl font-black text-white mb-8">
        JS Ai Hub 
      </h2>

      <div className="flex flex-col gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute inset-0 rounded-2xl bg-violet-500/15 border border-violet-500/40"
                />
              )}

              <Icon
                className={`relative z-10 w-5 h-5 ${
                  isActive ? "text-violet-400" : "text-zinc-400"
                }`}
              />

              <span
                className={`relative z-10 font-medium ${
                  isActive ? "text-white" : "text-zinc-400"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* History Button */}
        <button
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-zinc-400 hover:bg-violet-500/10 hover:text-white transition-all"
        >
          <History className="w-5 h-5" />
          <span>History</span>
        </button>
      </div>
    </aside>
  );
};