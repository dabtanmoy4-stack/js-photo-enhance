import React from "react";
import { Home, History, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NavigationTab } from "../types";

interface NavigationDrawerProps {
  isOpen: boolean;
  activeTab: NavigationTab;
  onClose: () => void;
  onTabChange: (tab: NavigationTab) => void;
  onOpenHistory: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  activeTab,
  onClose,
  onTabChange,
  onOpenHistory,
}) => {
  const menu = [
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed left-0 top-0 z-50 h-full w-72 bg-zinc-950 border-r border-violet-500/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-xl font-black text-white">
                JS Ai Hub Enhance
              </h2>

              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Menu */}
            <div className="p-4 space-y-2">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                      active
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-zinc-300 hover:bg-zinc-900"
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
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-zinc-300 hover:bg-zinc-900 transition"
              >
                <History className="w-5 h-5" />
                <span>History</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}