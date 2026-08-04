/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppViewModel } from './viewmodel/useAppViewModel';
import { SplashScreen } from './components/SplashScreen';
import { AndroidFrame } from './components/AndroidFrame';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavigation } from './components/BottomNavigation';
import { HomeScreen } from './components/HomeScreen';
import { StudioScreen } from './components/StudioScreen';
import { GalleryScreen } from './components/GalleryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AILoadingOverlay } from './components/AILoadingOverlay';
import { AIEnhanceModal } from './components/AIEnhanceModal';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { ExportModal } from './components/ExportModal';
import { RecentProjectsModal } from './components/RecentProjectsModal';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { SideMenu } from './components/SideMenu';

export default function App() {
  const vm = useAppViewModel();

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-violet-500 selection:text-black">
      {/* Splash Screen Overlay */}
      <AnimatePresence>
        {vm.showSplash && (
          <SplashScreen onFinish={() => vm.setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* AI Processing Loading Overlay */}
      <AnimatePresence>
        {vm.isAIEnhancing && (
          <AILoadingOverlay
            progress={vm.aiProgress}
            stepMessage={vm.aiStepMessage}
            modeLabel={vm.activeAIMode.replace('_', ' ').toUpperCase()}
          />
        )}
      </AnimatePresence>

      {/* AI Enhancement Selection Modal */}
      <AnimatePresence>
        {vm.aiModalOpen && (
          <AIEnhanceModal
            photoTitle={vm.selectedPhoto?.title || 'Selected Photo'}
            onRunAIEnhancement={vm.runAIEnhancement}
            onClose={vm.closeAIEnhanceModal}
          />
        )}
      </AnimatePresence>

      {/* Interactive Before vs After Comparison Slider */}
      {vm.beforeAfterModalOpen && vm.lastAIResult && vm.selectedPhoto && (
        <BeforeAfterSlider
          beforeUrl={vm.selectedPhoto.url}
          afterUrl={vm.lastAIResult.enhancedImageData}
          beforeTitle="Original"
          afterTitle="AI Enhanced"
          beforeDimensions={vm.lastAIResult.originalDimensions}
          afterDimensions={vm.lastAIResult.enhancedDimensions}
          modelUsed={vm.lastAIResult.modelUsed}
          processingTimeMs={vm.lastAIResult.processingTimeMs}
          onApply={vm.applyAIResultToStudio}
          onClose={vm.closeBeforeAfterModal}
        />
      )}

      {/* Export Modal */}
      <AnimatePresence>
        {vm.exportModalOpen && vm.selectedPhoto && (
          <ExportModal
            photo={vm.selectedPhoto}
            adjustments={vm.adjustments}
            onClose={vm.closeExportModal}
            onSaveToHistory={vm.addProjectHistoryItem}
          />
        )}
      </AnimatePresence>

      {/* Recent Projects History Modal */}
      <AnimatePresence>
        {vm.recentProjectsModalOpen && (
          <RecentProjectsModal
            historyItems={vm.projectHistory}
            onSelectProject={vm.selectHistoryProject}
            onClearHistory={vm.clearProjectHistory}
            onDeleteProject={vm.deleteProjectHistoryItem}
            onClose={vm.closeRecentProjectsModal}
          />
        )}
      </AnimatePresence>

      {/* Android Device Frame / Fullscreen Shell */}
      <AndroidFrame displayMode={vm.displayMode}>
        <div className="flex flex-col min-h-full">
          {/* Material 3 Top App Bar */}
          <TopAppBar vm={vm} />
<SideMenu
  isOpen={vm.sideMenuOpen}
  onClose={vm.toggleSideMenu}
  activeTab={vm.activeTab}
  onTabChange={vm.setActiveTab}
  onOpenHistory={vm.openRecentProjectsModal}
/>
          {/* Toast Notification Banner */}
          <AnimatePresence>
            {vm.toastMessage && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="sticky top-14 z-40 px-4 py-2 mx-4 my-2 rounded-xl bg-violet-500 text-black font-extrabold text-xs shadow-lg shadow-violet-950/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  <span>{vm.toastMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Tab View Canvas */}
          <main className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {vm.activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  <HomeScreen vm={vm} />
                </motion.div>
              )}

              {vm.activeTab === 'studio' && (
                <motion.div
                  key="studio"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  <StudioScreen vm={vm} />
                </motion.div>
              )}

              {vm.activeTab === 'gallery' && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  <GalleryScreen vm={vm} />
                </motion.div>
              )}

              {vm.activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  <SettingsScreen vm={vm} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Material 3 Bottom Navigation */}
          <BottomNavigation
            activeTab={vm.activeTab}
            onTabChange={vm.setActiveTab}
            galleryCount={vm.photos.length}
          />
        </div>
      </AndroidFrame>
    </div>
  );
}
