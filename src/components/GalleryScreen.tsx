import React, { useState } from 'react';
import { AppViewModel } from '../viewmodel/useAppViewModel';
import { motion, AnimatePresence } from 'motion/react';
import { UploadDropZone } from './UploadDropZone';
import { 
  Image as ImageIcon, 
  Trash2, 
  Sliders, 
  Plus, 
  Info, 
  Check, 
  X,
  Upload,
  Calendar,
  Maximize2
} from 'lucide-react';
import { PhotoItem } from '../types';

interface GalleryScreenProps {
  vm: AppViewModel;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ vm }) => {
  const [activePhotoModal, setActivePhotoModal] = useState<PhotoItem | null>(null);

  return (
    <div className="flex-1 p-4 space-y-4 pb-8">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">Photos Gallery</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
            {vm.photos.length} items
          </span>
        </div>

        <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 font-bold text-xs border border-zinc-800 transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
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

      {/* Drag & Drop Upload Zone */}
      <UploadDropZone onFileSelect={vm.uploadPhoto} compact />

      {/* Photos Grid */}
      {vm.photos.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-xs text-zinc-500">No photos in gallery yet.</p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs">
            <Plus className="w-4 h-4" />
            <span>Add Your First Photo</span>
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
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {vm.photos.map((photo) => {
            const isSelected = vm.selectedPhoto?.id === photo.id;
            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative rounded-2xl overflow-hidden bg-zinc-900 border transition-all ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-zinc-800 hover:border-emerald-500/40'
                }`}
              >
                {/* Image */}
                <div className="aspect-square w-full overflow-hidden relative">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Right Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-black p-1 rounded-full shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoModal(photo);
                        }}
                        className="p-1.5 rounded-lg bg-black/60 text-white hover:text-emerald-400 backdrop-blur-md"
                        title="Photo details"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <button
                        onClick={() => vm.setSelectedPhoto(photo, true)}
                        className="flex-1 py-1 px-2 rounded-lg bg-emerald-500 text-black font-extrabold text-[11px] flex items-center justify-center gap-1"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          vm.deletePhoto(photo.id);
                        }}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Title */}
                <div className="p-2.5 flex flex-col">
                  <span className="text-xs font-bold text-white truncate">
                    {photo.title}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-0.5 font-mono">
                    <span>{photo.width}×{photo.height}</span>
                    <span className="text-emerald-400">{photo.category || 'Local'}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Photo Info Detail Modal */}
      <AnimatePresence>
        {activePhotoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center"
            onClick={() => setActivePhotoModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-emerald-500/30 p-5 space-y-4 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                  <span>Photo Metadata</span>
                </h3>
                <button
                  onClick={() => setActivePhotoModal(null)}
                  className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src={activePhotoModal.url}
                  alt={activePhotoModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Title:</span>
                  <span className="text-white font-bold">{activePhotoModal.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Resolution:</span>
                  <span className="text-emerald-400">{activePhotoModal.width} × {activePhotoModal.height} px</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Size:</span>
                  <span className="text-zinc-200">{activePhotoModal.sizeKb} KB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Added:</span>
                  <span className="text-zinc-200">{activePhotoModal.timestamp}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    vm.setSelectedPhoto(activePhotoModal, true);
                    setActivePhotoModal(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Open in Studio</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
