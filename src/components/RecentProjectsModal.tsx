import React from 'react';
import { motion } from 'motion/react';
import { History, X, Sparkles, Sliders, Trash2, ArrowUpRight, Clock, Image as ImageIcon, Eye } from 'lucide-react';
import { ProjectHistoryItem } from '../types';

interface RecentProjectsModalProps {
  historyItems: ProjectHistoryItem[];
  onSelectProject: (item: ProjectHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteProject: (id: string) => void;
  onClose: () => void;
}

export const RecentProjectsModal: React.FC<RecentProjectsModalProps> = ({
  historyItems,
  onSelectProject,
  onClearHistory,
  onDeleteProject,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">Project History & Edits</h3>
              <p className="text-[11px] text-zinc-400">Recently enhanced photos & saved project states</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {historyItems.length > 0 && (
              <button
                onClick={onClearHistory}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 border border-zinc-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-none">
          {historyItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 text-zinc-500">
              <div className="w-16 h-16 rounded-3xl bg-zinc-800/50 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 stroke-1 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-300">No project history yet</p>
                <p className="text-xs text-zinc-500 max-w-xs mt-0.5">
                  Enhance or export photos in Studio to build your recent projects history!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative p-3 rounded-2xl bg-zinc-950 border border-zinc-850 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-2.5 border border-zinc-800">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                        {item.format.toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => onSelectProject(item)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-black flex items-center gap-1 shadow-lg"
                      >
                        <Eye className="w-3.5 h-3.5" /> Re-open
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate max-w-[160px]">{item.title}</h4>
                      <button
                        onClick={() => onDeleteProject(item.id)}
                        className="text-zinc-600 hover:text-red-400 p-1 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" /> {item.timestamp}
                      </span>
                      <span className="font-mono text-zinc-500">{item.width}×{item.height} px</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
