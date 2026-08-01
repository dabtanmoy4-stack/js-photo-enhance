import { PhotoItem, DEFAULT_ADJUSTMENTS } from '../types';

export const INITIAL_SAMPLE_PHOTOS: PhotoItem[] = [
  {
    id: 'sample-1',
    title: 'Portrait Bokeh',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
    originalUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
    timestamp: 'Just now',
    width: 1920,
    height: 1280,
    sizeKb: 1420,
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      brightness: 10,
      contrast: 15,
      saturation: 5,
      sharpness: 25,
      vignette: 10,
      temperature: 5
    },
    category: 'Portrait'
  },
  {
    id: 'sample-2',
    title: 'Mountain Skyline',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000',
    originalUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000',
    timestamp: '2 hours ago',
    width: 2560,
    height: 1440,
    sizeKb: 2180,
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      contrast: 20,
      saturation: 25,
      sharpness: 40,
      vignette: 15,
      temperature: -10
    },
    category: 'Landscape'
  },
  {
    id: 'sample-3',
    title: 'Neon Urban Architecture',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=1000',
    originalUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=1000',
    timestamp: 'Yesterday',
    width: 1920,
    height: 1080,
    sizeKb: 1850,
    adjustments: {
      ...DEFAULT_ADJUSTMENTS,
      brightness: 5,
      contrast: 30,
      saturation: 20,
      sharpness: 30,
      vignette: 20
    },
    category: 'Urban'
  }
];

