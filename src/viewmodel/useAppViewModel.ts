import { useState, useEffect, useCallback } from 'react';
import { PhotoItem, PhotoAdjustments, NavigationTab, PresetFilter, DisplayMode, DEFAULT_ADJUSTMENTS, ProjectHistoryItem } from '../types';
import { INITIAL_SAMPLE_PHOTOS } from '../data/samplePhotos';

const STORAGE_KEY = 'js_photo_enhance_gallery_v1';
const HISTORY_STORAGE_KEY = 'js_photo_enhance_history_v1';
const SETTINGS_KEY = 'js_photo_enhance_settings_v1';

export function useAppViewModel() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('device');
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

const toggleSideMenu = useCallback(() => {
  setSideMenuOpen(prev => !prev);
}, []);
  // App Settings State (Language, Animation Toggle)
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.language) return parsed.language;
      }
    } catch {}
    return 'en';
  });

  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.animationsEnabled === 'boolean') return parsed.animationsEnabled;
      }
    } catch {}
    return true;
  });

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ language, animationsEnabled }));
    } catch (e) {
      console.warn('Could not save settings:', e);
    }
  }, [language, animationsEnabled]);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
  }, []);

  const setAnimationsEnabled = useCallback((enabled: boolean) => {
    setAnimationsEnabledState(enabled);
  }, []);
  
  // Gallery state
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_SAMPLE_PHOTOS;
  });

  // Recent Projects History state
  const [projectHistory, setProjectHistory] = useState<ProjectHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [recentProjectsModalOpen, setRecentProjectsModalOpen] = useState<boolean>(false);

  // Selected Photo for Editing / Viewing
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(() => INITIAL_SAMPLE_PHOTOS[0]);
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>(DEFAULT_ADJUSTMENTS);
  const [presetFilter, setPresetFilter] = useState<PresetFilter>('none');
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Enhancement Suite State
  const [isAIEnhancing, setIsAIEnhancing] = useState<boolean>(false);
  const [aiProgress, setAiProgress] = useState<number>(0);
  const [aiStepMessage, setAiStepMessage] = useState<string>('');
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [beforeAfterModalOpen, setBeforeAfterModalOpen] = useState<boolean>(false);
  const [lastAIResult, setLastAIResult] = useState<any | null>(null);
  const [activeAIMode, setActiveAIMode] = useState<string>('ai_enhance');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const handleUploadPhoto = useCallback((file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const resultUrl = e.target?.result as string;
      if (!resultUrl) {
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const newPhoto: PhotoItem = {
          id: `user-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, "") || 'Uploaded Photo',
          url: resultUrl,
          originalUrl: resultUrl,
          timestamp: 'Just now',
          width: img.width || 1280,
          height: img.height || 720,
          sizeKb: Math.round(file.size / 1024),
          adjustments: { ...DEFAULT_ADJUSTMENTS },
          category: 'User Import'
        };

        setPhotos((prev) => [newPhoto, ...prev]);
        setSelectedPhoto(newPhoto);
        setIsProcessing(false);
        setActiveTab('studio');
        showToast('Photo loaded into JS Studio');
      };
      img.src = resultUrl;
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  // Auto-hide Splash screen after 2.2 seconds on initial launch
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Global paste handler for Ctrl+V
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleUploadPhoto(file);
            showToast('Pasted image loaded from clipboard!');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleUploadPhoto, showToast]);

  // Sync photos to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch (e) {
      console.warn('Could not save gallery to localStorage', e);
    }
  }, [photos]);

  // Sync project history to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(projectHistory));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [projectHistory]);

  const handleOpenExportModal = useCallback(() => {
    setExportModalOpen(true);
  }, []);

  const handleCloseExportModal = useCallback(() => {
    setExportModalOpen(false);
  }, []);

  const handleOpenRecentProjectsModal = useCallback(() => {
    setRecentProjectsModalOpen(true);
  }, []);

  const handleCloseRecentProjectsModal = useCallback(() => {
    setRecentProjectsModalOpen(false);
  }, []);

  const handleAddProjectHistoryItem = useCallback((record: Omit<ProjectHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: ProjectHistoryItem = {
      ...record,
      id: `proj-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setProjectHistory((prev) => [newItem, ...prev.slice(0, 19)]);
  }, []);

  const handleClearProjectHistory = useCallback(() => {
    setProjectHistory([]);
    showToast('Project history cleared');
  }, [showToast]);

  const handleDeleteProjectHistoryItem = useCallback((id: string) => {
    setProjectHistory((prev) => prev.filter((p) => p.id !== id));
    showToast('Project history record deleted');
  }, [showToast]);

  const handleSelectHistoryProject = useCallback((item: ProjectHistoryItem) => {
    const matched = photos.find((p) => p.id === item.photoId);
    if (matched) {
      setSelectedPhoto({
        ...matched,
        url: item.thumbnailUrl,
        adjustments: item.adjustments
      });
    } else {
      const restoredPhoto: PhotoItem = {
        id: item.photoId,
        title: item.title,
        url: item.thumbnailUrl,
        originalUrl: item.thumbnailUrl,
        timestamp: item.timestamp,
        width: item.width,
        height: item.height,
        sizeKb: 1000,
        adjustments: item.adjustments,
        category: 'History Restore'
      };
      setSelectedPhoto(restoredPhoto);
    }
    setAdjustments(item.adjustments);
    setRecentProjectsModalOpen(false);
    setActiveTab('studio');
    showToast(`Loaded ${item.title} into Studio`);
  }, [photos, showToast]);

  // History for Undo / Redo
  const [history, setHistory] = useState<PhotoAdjustments[]>([DEFAULT_ADJUSTMENTS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // When selected photo changes, load its existing adjustments or default
  useEffect(() => {
    if (selectedPhoto) {
      const initialAdj = selectedPhoto.adjustments || DEFAULT_ADJUSTMENTS;
      setAdjustments(initialAdj);
      setHistory([initialAdj]);
      setHistoryIndex(0);
      setPresetFilter('none');
    }
  }, [selectedPhoto?.id]);

  const handleSelectPhoto = useCallback((photo: PhotoItem, navToStudio = true) => {
    setSelectedPhoto(photo);
    if (navToStudio) {
      setActiveTab('studio');
    }
  }, []);

  const pushToHistory = useCallback((newAdj: PhotoAdjustments) => {
    setHistory((prev) => {
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, newAdj];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUpdateAdjustment = useCallback((key: keyof PhotoAdjustments, value: number) => {
    setAdjustments((prev) => {
      const updated = { ...prev, [key]: value };
      pushToHistory(updated);
      return updated;
    });
  }, [pushToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setAdjustments(history[newIndex]);
      showToast('Undo applied');
    }
  }, [historyIndex, history, showToast]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setAdjustments(history[newIndex]);
      showToast('Redo applied');
    }
  }, [historyIndex, history, showToast]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleApplyPreset = useCallback((preset: PresetFilter) => {
    setPresetFilter(preset);
    let newAdj = { ...DEFAULT_ADJUSTMENTS };
    switch (preset) {
      case 'vivid':
        newAdj = { ...DEFAULT_ADJUSTMENTS, brightness: 10, contrast: 25, saturation: 35, sharpness: 20, vignette: 10, temperature: 5 };
        break;
      case 'clarity':
        newAdj = { ...DEFAULT_ADJUSTMENTS, brightness: 5, contrast: 30, exposure: 10, highlights: -15, shadows: 20, saturation: 10, sharpness: 50, temperature: -5 };
        break;
      case 'violet_glow':
        newAdj = { ...DEFAULT_ADJUSTMENTS, brightness: 15, contrast: 15, exposure: 5, saturation: 20, sharpness: 15, vignette: 25, temperature: -15, tint: -10 };
        break;
      case 'vintage':
        newAdj = { ...DEFAULT_ADJUSTMENTS, brightness: 5, contrast: -10, shadows: 15, saturation: -15, vignette: 35, temperature: 30, tint: 10 };
        break;
      case 'high_contrast':
        newAdj = { ...DEFAULT_ADJUSTMENTS, contrast: 50, exposure: 10, highlights: 20, shadows: -20, saturation: 15, sharpness: 30, vignette: 20 };
        break;
      case 'b_w':
        newAdj = { ...DEFAULT_ADJUSTMENTS, brightness: 5, contrast: 25, saturation: -100, sharpness: 25, vignette: 25 };
        break;
      case 'none':
      default:
        newAdj = selectedPhoto?.adjustments || { ...DEFAULT_ADJUSTMENTS };
        break;
    }
    setAdjustments(newAdj);
    pushToHistory(newAdj);
  }, [selectedPhoto, pushToHistory]);

  const handleResetAdjustments = useCallback(() => {
    const resetVal = { ...DEFAULT_ADJUSTMENTS };
    setAdjustments(resetVal);
    pushToHistory(resetVal);
    setPresetFilter('none');
    showToast('Reset all adjustments');
  }, [pushToHistory, showToast]);

  const handleSavePhotoToGallery = useCallback(() => {
    if (!selectedPhoto) return;

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === selectedPhoto.id
          ? { ...p, adjustments: { ...adjustments }, timestamp: 'Updated just now' }
          : p
      )
    );

    setSelectedPhoto((prev) => prev ? { ...prev, adjustments: { ...adjustments } } : null);
    showToast('Photo adjustments saved');
  }, [selectedPhoto, adjustments, showToast]);

  const handleUpdatePhotoUrl = useCallback((newUrl: string, newWidth?: number, newHeight?: number) => {
    if (!selectedPhoto) return;

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === selectedPhoto.id
          ? {
              ...p,
              url: newUrl,
              width: newWidth || p.width,
              height: newHeight || p.height,
              timestamp: 'Cropped just now'
            }
          : p
      )
    );

    setSelectedPhoto((prev) =>
      prev
        ? {
            ...prev,
            url: newUrl,
            width: newWidth || prev.width,
            height: newHeight || prev.height
          }
        : null
    );

    showToast('Photo crop applied!');
  }, [selectedPhoto, showToast]);

  const handleDeletePhoto = useCallback((photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    if (selectedPhoto?.id === photoId) {
      const remaining = photos.filter((p) => p.id !== photoId);
      setSelectedPhoto(remaining[0] || null);
    }
    showToast('Photo removed');
  }, [photos, selectedPhoto, showToast]);

  const handleReplaySplash = useCallback(() => {
    setShowSplash(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 2200);
  }, []);

  // AI Enhancement Functions
  const handleOpenAIEnhanceModal = useCallback((mode = 'ai_enhance') => {
    if (!selectedPhoto) {
      showToast('Select or upload a photo first');
      return;
    }
    setActiveAIMode(mode);
    setAiModalOpen(true);
  }, [selectedPhoto, showToast]);

  const handleCloseAIEnhanceModal = useCallback(() => {
    setAiModalOpen(false);
  }, []);

  const handleCloseBeforeAfterModal = useCallback(() => {
    setBeforeAfterModalOpen(false);
  }, []);

  const handleRunAIEnhancement = useCallback(async (mode: string, options?: any) => {
  if (!selectedPhoto) return;

  setAiModalOpen(false);
  setIsAIEnhancing(true);

  try {
    let imageData = selectedPhoto.url;

    // যদি URL হয় তাহলে আগে Base64-তে convert করো
    if (imageData.startsWith("http")) {
      const img = await fetch(imageData);
      const blob = await img.blob();

      imageData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }

    const response = await fetch("/api/ai-enhance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageData,
        mode,
        options,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "AI Enhancement failed");
    }

    setLastAIResult(result);
    setBeforeAfterModalOpen(true);

  } catch (err: any) {
    console.error(err);
    showToast(err.message || "AI Enhancement failed");
  } finally {
    setIsAIEnhancing(false);
  }
}, [selectedPhoto, showToast]);

  const handleApplyAIResultToStudio = useCallback(() => {
    if (!lastAIResult || !selectedPhoto) return;

    const newUrl = lastAIResult.enhancedImageData;
    const newW = lastAIResult.enhancedDimensions?.width || selectedPhoto.width;
    const newH = lastAIResult.enhancedDimensions?.height || selectedPhoto.height;

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === selectedPhoto.id
          ? {
              ...p,
              url: newUrl,
              width: newW,
              height: newH,
              timestamp: 'AI Enhanced just now'
            }
          : p
      )
    );

    setSelectedPhoto((prev) =>
      prev
        ? {
            ...prev,
            url: newUrl,
            width: newW,
            height: newH
          }
        : null
    );

    setBeforeAfterModalOpen(false);
    setActiveTab('studio');
    showToast('AI Enhanced photo applied to studio!');
  }, [lastAIResult, selectedPhoto, showToast]);

  return {
    // State
    activeTab,
    showSplash,
    displayMode,
    sideMenuOpen,
    photos,
    selectedPhoto,
    adjustments,
    presetFilter,
    compareMode,
    isProcessing,
    toastMessage,
    canUndo,
    canRedo,

    // AI State
    isAIEnhancing,
    aiProgress,
    aiStepMessage,
    aiModalOpen,
    beforeAfterModalOpen,
    lastAIResult,
    activeAIMode,

    // Export & History State
    exportModalOpen,
    recentProjectsModalOpen,
    projectHistory,

    // App Preferences State
    language,
    animationsEnabled,
    setLanguage,
    setAnimationsEnabled,

    // Actions
    setActiveTab,
    setShowSplash,
    setDisplayMode,
    toggleSideMenu,
    setSelectedPhoto: handleSelectPhoto,
    uploadPhoto: handleUploadPhoto,
    updateAdjustment: handleUpdateAdjustment,
    undo: handleUndo,
    redo: handleRedo,
    applyPreset: handleApplyPreset,
    resetAdjustments: handleResetAdjustments,
    savePhotoToGallery: handleSavePhotoToGallery,
    updatePhotoUrl: handleUpdatePhotoUrl,
    deletePhoto: handleDeletePhoto,
    setCompareMode,
    replaySplash: handleReplaySplash,
    showToast,

    // Export & History Actions
    openExportModal: handleOpenExportModal,
    closeExportModal: handleCloseExportModal,
    openRecentProjectsModal: handleOpenRecentProjectsModal,
    closeRecentProjectsModal: handleCloseRecentProjectsModal,
    addProjectHistoryItem: handleAddProjectHistoryItem,
    clearProjectHistory: handleClearProjectHistory,
    deleteProjectHistoryItem: handleDeleteProjectHistoryItem,
    selectHistoryProject: handleSelectHistoryProject,

    // AI Actions
    openAIEnhanceModal: handleOpenAIEnhanceModal,
    closeAIEnhanceModal: handleCloseAIEnhanceModal,
    closeBeforeAfterModal: handleCloseBeforeAfterModal,
    runAIEnhancement: handleRunAIEnhancement,
    applyAIResultToStudio: handleApplyAIResultToStudio
  };
}

export type AppViewModel = ReturnType<typeof useAppViewModel>;
