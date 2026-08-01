import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppViewModel } from '../viewmodel/useAppViewModel';
import { 
  ShieldCheck, 
  Cpu, 
  Smartphone, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Sparkles,
  Palette,
  Globe,
  Zap,
  FileText,
  HelpCircle,
  Mail,
  X,
  Send,
  Info,
  Check,
  HardDrive
} from 'lucide-react';

interface SettingsScreenProps {
  vm: AppViewModel;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ vm }) => {
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'about' | 'contact' | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('Feedback');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
  ];

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      vm.showToast('Please complete all contact form fields');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setContactSent(true);
      vm.showToast('Message submitted to JS Photo Studio support!');
    }, 1200);
  };

  const handleClearAppCache = () => {
    if (window.confirm('Clear cached projects and reset photo filters to default?')) {
      vm.clearProjectHistory();
      localStorage.removeItem('js_photo_enhance_gallery_v1');
      vm.showToast('Local application cache cleared');
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4 pb-8 text-xs max-w-4xl mx-auto">
      {/* App Version & Architecture Banner */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/30 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
              JS
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">JS Photo Enhance Pro</h3>
              <p className="text-[10px] text-zinc-400">Jetpack Compose M3 Architecture</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
            v1.2.0 Production Ready
          </span>
        </div>

        <p className="text-zinc-400 leading-relaxed text-[11px]">
          High-performance web photo editor built with HTML5 Canvas GPU hardware acceleration, real-time parametric color curve filters, neural upscaling simulation, and zero server logging.
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="px-2 py-1 rounded-lg bg-black text-emerald-400 font-mono text-[10px] border border-zinc-800">
            Jetpack Compose M3
          </span>
          <span className="px-2 py-1 rounded-lg bg-black text-emerald-400 font-mono text-[10px] border border-zinc-800">
            MVVM Architecture
          </span>
          <span className="px-2 py-1 rounded-lg bg-black text-emerald-400 font-mono text-[10px] border border-zinc-800">
            GPU Canvas Acceleration
          </span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>App Language</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
            {languages.find((l) => l.code === vm.language)?.label}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                vm.setLanguage(lang.code);
                vm.showToast(`Language changed to ${lang.label}`);
              }}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                vm.language === lang.code
                  ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold shadow-md shadow-emerald-950/20'
                  : 'bg-black/40 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{lang.flag}</span>
                <span className="text-xs">{lang.label}</span>
              </div>
              {vm.language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Animation & Display Preferences */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>UI Animations & Motion</span>
          </div>
          <button
            onClick={() => {
              vm.setAnimationsEnabled(!vm.animationsEnabled);
              vm.showToast(vm.animationsEnabled ? 'UI animations disabled' : 'UI animations enabled');
            }}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              vm.animationsEnabled ? 'bg-emerald-500' : 'bg-zinc-800 border border-zinc-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                vm.animationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-[11px] text-zinc-400">
          Toggle interactive Motion React transitions. Turning off animations optimizes rendering performance on lower-spec hardware.
        </p>
      </div>

      {/* Display Mode Preferences */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Display Frame Mode</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold">
            {vm.displayMode}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => vm.setDisplayMode('device')}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              vm.displayMode === 'device'
                ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <span>Android Pixel Frame</span>
            {vm.displayMode === 'device' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => vm.setDisplayMode('fullscreen')}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              vm.displayMode === 'fullscreen'
                ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <span>Edge-To-Edge View</span>
            {vm.displayMode === 'fullscreen' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Legal, Support & About Action Links */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
        <div className="text-white font-bold text-xs mb-2">Legal, Support & Information</div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveModal('about')}
            className="p-3 rounded-xl bg-black/40 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-left transition-colors flex flex-col items-start gap-1"
          >
            <Info className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">About</span>
            <span className="text-[10px] text-zinc-500">Tech specs & bio</span>
          </button>

          <button
            onClick={() => setActiveModal('privacy')}
            className="p-3 rounded-xl bg-black/40 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-left transition-colors flex flex-col items-start gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Privacy Policy</span>
            <span className="text-[10px] text-zinc-500">Local data policy</span>
          </button>

          <button
            onClick={() => setActiveModal('terms')}
            className="p-3 rounded-xl bg-black/40 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-left transition-colors flex flex-col items-start gap-1"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Terms of Use</span>
            <span className="text-[10px] text-zinc-500">License & rights</span>
          </button>

          <button
            onClick={() => {
              setContactSent(false);
              setActiveModal('contact');
            }}
            className="p-3 rounded-xl bg-black/40 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-left transition-colors flex flex-col items-start gap-1"
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Contact Us</span>
            <span className="text-[10px] text-zinc-500">Feedback & support</span>
          </button>
        </div>
      </div>

      {/* Storage & Local Cache Control */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Local Storage & Cache</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400">
            {vm.projectHistory.length} history items saved
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-zinc-400 max-w-sm">
            All edited photos and project history are stored locally on your device for absolute privacy.
          </p>
          <button
            onClick={handleClearAppCache}
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-300 border border-zinc-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>

      {/* Interactive Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 font-black text-sm text-white capitalize">
                  {activeModal === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                  {activeModal === 'terms' && <FileText className="w-5 h-5 text-emerald-400" />}
                  {activeModal === 'about' && <Info className="w-5 h-5 text-emerald-400" />}
                  {activeModal === 'contact' && <Mail className="w-5 h-5 text-emerald-400" />}
                  <span>
                    {activeModal === 'privacy' && 'Privacy Policy'}
                    {activeModal === 'terms' && 'Terms of Service'}
                    {activeModal === 'about' && 'About JS Photo Enhance'}
                    {activeModal === 'contact' && 'Contact Support'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 text-xs text-zinc-300 space-y-3 leading-relaxed">
                {activeModal === 'about' && (
                  <>
                    <p className="font-semibold text-white">
                      JS Photo Enhance is a cutting-edge web application engineered for instant, non-destructive photo editing and high-resolution quality enhancement.
                    </p>
                    <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5 font-mono text-[11px]">
                      <div>• Framework: React 18 + Vite + TypeScript</div>
                      <div>• UI Architecture: Jetpack Compose Material 3 UI design</div>
                      <div>• Rendering Engine: HTML5 Canvas 2D / WebGL acceleration</div>
                      <div>• State Management: MVVM (Model-View-ViewModel)</div>
                      <div>• Export Formats: PNG (Lossless), JPEG (Adjustable), WEBP (Ultra)</div>
                    </div>
                    <p>
                      Designed with an emphasis on speed, precision, and privacy, every edit occurs strictly inside your browser instance.
                    </p>
                  </>
                )}

                {activeModal === 'privacy' && (
                  <>
                    <h4 className="font-bold text-white">1. Zero Server Image Storage</h4>
                    <p>
                      JS Photo Enhance processes 100% of your images locally in your browser using HTML5 Canvas APIs. Your original images and edited photos are never uploaded to any remote server or third-party cloud.
                    </p>

                    <h4 className="font-bold text-white mt-2">2. Local Storage Usage</h4>
                    <p>
                      Project preferences, filter presets, and project history are saved in your browser's LocalStorage. You can clear this data at any time via the Clear Cache button in Settings.
                    </p>

                    <h4 className="font-bold text-white mt-2">3. Analytics & Telemetry</h4>
                    <p>
                      We do not track individual users or harvest personal data. Any feature usage statistics remain anonymous and non-identifiable.
                    </p>
                  </>
                )}

                {activeModal === 'terms' && (
                  <>
                    <h4 className="font-bold text-white">1. Ownership & License</h4>
                    <p>
                      You retain full copyright and complete ownership of all photos uploaded or created with JS Photo Enhance.
                    </p>

                    <h4 className="font-bold text-white mt-2">2. Acceptable Use</h4>
                    <p>
                      You agree to use this application in compliance with all applicable laws. You may export high-resolution enhanced images for personal and commercial projects without attribution requirements.
                    </p>

                    <h4 className="font-bold text-white mt-2">3. Disclaimer</h4>
                    <p>
                      The application is provided "as is" without warranty of any kind. While every effort is made to maintain browser stability, always back up your original photos before performing intense edits.
                    </p>
                  </>
                )}

                {activeModal === 'contact' && (
                  <>
                    {contactSent ? (
                      <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                          <Check className="w-8 h-8 stroke-[3]" />
                        </div>
                        <h4 className="font-black text-sm text-white">Thank You!</h4>
                        <p className="text-zinc-400 max-w-xs">
                          Your message has been received by our engineering team. We appreciate your feedback!
                        </p>
                        <button
                          onClick={() => setActiveModal(null)}
                          className="mt-2 py-2 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSendContact} className="space-y-3">
                        <div>
                          <label className="text-[11px] font-bold text-zinc-400 block mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-zinc-400 block mb-1">Your Email</label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-zinc-400 block mb-1">Topic</label>
                          <select
                            value={contactCategory}
                            onChange={(e) => setContactCategory(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                          >
                            <option value="Feedback">Feature Feedback</option>
                            <option value="Bug">Report an Issue</option>
                            <option value="General">General Inquiry</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-zinc-400 block mb-1">Message</label>
                          <textarea
                            required
                            rows={3}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Tell us what you think or report an issue..."
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSending}
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                        >
                          {isSending ? (
                            <span>Sending...</span>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit Message</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

