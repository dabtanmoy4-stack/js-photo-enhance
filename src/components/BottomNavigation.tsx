import React from 'react';
import { NavigationTab } from '../types';
import { Home, Sliders, Image as ImageIcon, Settings, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  galleryCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  galleryCount = 0
}) => {
  const tabs = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'studio' as NavigationTab, label: 'JS Studio', icon: Sliders, badge: 'HD' },
    { id: 'gallery' as NavigationTab, label: 'Gallery', icon: ImageIcon, count: galleryCount },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-black/95 backdrop-blur-md border-t border-violet-900/40 text-white py-2 px-3 shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center group py-1 px-3 rounded-2xl transition-all"
            >
              {/* Active Pill background animation (Material 3 style) */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-violet-500/15 rounded-2xl border border-violet-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon Container with active indicator */}
              <div
                className={`relative p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-violet-400 scale-110'
                    : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              >
                <Icon className="w-5 h-5" />

                {/* Optional Badge */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-violet-500 text-black text-[9px] font-black rounded-full font-mono">
                    {tab.badge}
                  </span>
                )}

                {/* Count Badge */}
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-zinc-800 text-violet-400 text-[9px] font-mono font-bold rounded-full border border-violet-500/40">
                    {tab.count}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 transition-colors ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-zinc-400 group-hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
