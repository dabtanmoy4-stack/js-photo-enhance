export type NavigationTab = 'home' | 'studio' | 'gallery' | 'settings';

export interface PhotoAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  exposure: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  saturation: number; // -100 to 100
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  sharpness: number; // 0 to 100
  blur: number; // 0 to 20
  vignette: number; // 0 to 100
}

export const DEFAULT_ADJUSTMENTS: PhotoAdjustments = {
  brightness: 0,
  contrast: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  sharpness: 0,
  blur: 0,
  vignette: 0
};

export interface SpatialTransformations {
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  zoom: number; // e.g. 1.0, 1.5, 2.0
  panX: number;
  panY: number;
}

export interface CropRect {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  width: number; // 0-100 percentage
  height: number; // 0-100 percentage
}

export interface PhotoItem {
  id: string;
  title: string;
  url: string;
  originalUrl: string;
  timestamp: string;
  width: number;
  height: number;
  sizeKb: number;
  adjustments: PhotoAdjustments;
  category?: string;
}

export type PresetFilter = 'none' | 'vivid' | 'clarity' | 'emerald_glow' | 'vintage' | 'high_contrast' | 'b_w';

export type DisplayMode = 'device' | 'fullscreen';

export type ExportFormat = 'png' | 'jpeg' | 'webp';

export type ResolutionMode = 'original' | '2x' | '4x' | 'custom';

export interface ExportSettings {
  format: ExportFormat;
  quality: number; // 0.1 to 1.0
  resolutionMode: ResolutionMode;
  customWidth: number;
  customHeight: number;
  keepAspectRatio: boolean;
  fileName: string;
}

export interface ProjectHistoryItem {
  id: string;
  photoId: string;
  title: string;
  thumbnailUrl: string;
  timestamp: string;
  width: number;
  height: number;
  adjustments: PhotoAdjustments;
  format: ExportFormat;
}

