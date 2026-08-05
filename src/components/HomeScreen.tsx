import React from "react";
import { motion } from "motion/react";
import { AppViewModel } from "../viewmodel/useAppViewModel";
import { JSLogo } from "./JSLogo";
import { UploadDropZone } from "./UploadDropZone";

import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Wand2,
  ChevronRight,
  Zap,
  ShieldCheck,
  CheckCircle2,
  History,
  Download,
} from "lucide-react";

interface HomeScreenProps {
  vm: AppViewModel;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ vm }) => {
  return (
    <div className="flex-1 p-4 sm:p-5 pb-8 space-y-5">

      {/* ================= HERO ================= */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="ai-border relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-6 shadow-xl"
        >
       <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10">

          <div className="flex items-center justify-between">

            <JSLogo size="md" />

            <span className="flex items-center gap-1 rounded-full border border-violet-500/40 bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">

              <Zap className="h-3 w-3" />

              Ready

            </span>

          </div>

          <div className="mt-5">

            <h1 className="text-3xl font-black text-white">

              Your Ultimate

              <span className="block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">

                AI Workspace

              </span>

            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">

              Chat, create, enhance and edit your photos with powerful AI.
              Everything you need is available from one modern workspace.

            </p>

          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">

            <button
  onClick={() => vm.showToast("AI Chat - Coming Soon")}
  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-bold text-white transition hover:scale-[1.02]"
>
  <span className="flex items-center justify-center gap-2">
    <Sparkles className="h-4 w-4" />
    AI Chat
  </span>
</button>

            <button
              onClick={vm.openRecentProjectsModal}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800"
            >
              History ({vm.projectHistory.length})
            </button>
            <button
              onClick={() => vm.showToast("AI Chat - Coming Soon")}
              className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Chat
              </span>
            </button>

            <label className="cursor-pointer rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-bold text-white hover:bg-zinc-800">

              <span className="flex items-center justify-center gap-2">
                <Upload className="h-4 w-4 text-violet-400" />
                Import Photo
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
              
                  }
                }}
              />
            </label>

          </div>

        </div>

      </motion.div>

      {/* Upload Area */}

    

      {/* ================= AI TOOLS ================= */}

      <div className="space-y-3">

        <div className="flex items-center justify-between">

          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
            <Sparkles className="h-4 w-4 text-violet-400" />
            AI Tools
          </h2>

          <button
            onClick={() => vm.openAIEnhanceModal("ai_enhance")}
            className="flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </button>

        </div>

        <div className="grid gap-3">

   <div className="grid grid-cols-2 gap-3">

  {/* JS Image Studio */}
  <button
    onClick={() => vm.openAIEnhanceModal("image_studio")}
    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-violet-500/50"
  >
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
      <ImageIcon className="h-5 w-5 text-violet-400" />
    </div>

    <h3 className="text-sm font-bold text-white">
      JS Image Studio
    </h3>

    <p className="mt-1 text-xs text-zinc-400">
      AI Enhance
    </p>
  </button>

  {/* AI Chat */}
  <button
    onClick={() => vm.showToast("AI Chat - Coming Soon")}
    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-violet-500/50"
  >
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
      <Sparkles className="h-5 w-5 text-violet-400" />
    </div>

    <h3 className="text-sm font-bold text-white">
      AI Chat
    </h3>

    <p className="mt-1 text-xs text-zinc-400">
      Coming Soon
    </p>
  </button>

  {/* Image AI */}
  <button
    onClick={() => vm.showToast("Image AI - Coming Soon")}
    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-violet-500/50"
  >
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
      <ImageIcon className="h-5 w-5 text-violet-400" />
    </div>

    <h3 className="text-sm font-bold text-white">
      Image AI
    </h3>

    <p className="mt-1 text-xs text-zinc-400">
      Coming Soon
    </p>
  </button>

</div>
          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={() => vm.showToast("AI Chat - Coming Soon")}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-violet-500/50"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                <Sparkles className="h-5 w-5 text-violet-400" />
              </div>

              <h3 className="text-sm font-bold text-white">
                AI Chat
              </h3>

              <p className="mt-1 text-xs text-zinc-400">
                Coming Soon
              </p>
            </button>

            <button
              onClick={() => vm.showToast("Image AI - Coming Soon")}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-violet-500/50"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                <ImageIcon className="h-5 w-5 text-violet-400" />
              </div>

              <h3 className="text-sm font-bold text-white">
                Image AI
              </h3>

              <p className="mt-1 text-xs text-zinc-400">
                Coming Soon
              </p>
            </button>

          </div>

      </div>
    
        </div>


  

     

   
      {/* ================= AI STATUS ================= */}

      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-zinc-900 to-[#1A0B2E] p-4 space-y-3">
        <div className="flex items-center justify-between">

          <h2 className="flex items-center gap-2 text-sm font-bold text-white">
            <ShieldCheck className="h-4 w-4 text-violet-400" />
            AI System Status
          </h2>

          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-[10px] font-bold text-violet-300">
            ONLINE
          </span>

        </div>

        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
            <p className="text-xs text-zinc-400">AI Engine</p>
            <p className="mt-1 text-sm font-bold text-violet-300">
              JS AI Hub
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
            <p className="text-xs text-zinc-400">Status</p>
            <p className="mt-1 text-sm font-bold text-green-400">
              Ready
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
            <p className="text-xs text-zinc-400">Projects</p>
            <p className="mt-1 text-sm font-bold text-white">
              {vm.projectHistory.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
            <p className="text-xs text-zinc-400">Photos</p>
            <p className="mt-1 text-sm font-bold text-white">
              {vm.photos.length}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
