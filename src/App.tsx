/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

import { AnimatePresence, motion } from "motion/react";

import { useAppViewModel } from "./viewmodel/useAppViewModel";

import { SplashScreen } from "./components/SplashScreen";
import { AndroidFrame } from "./components/AndroidFrame";
import { TopAppBar } from "./components/TopAppBar";
import { BottomNavigation } from "./components/BottomNavigation";

import { HomeScreen } from "./components/HomeScreen";
import { StudioScreen } from "./components/StudioScreen";
import { GalleryScreen } from "./components/GalleryScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import AIChat from "./pages/AIChat";


import { AILoadingOverlay } from "./components/AILoadingOverlay";
import { AIEnhanceModal } from "./components/AIEnhanceModal";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { ExportModal } from "./components/ExportModal";
import { RecentProjectsModal } from "./components/RecentProjectsModal";



export default function App(){

const vm = useAppViewModel();



return (

<>


{/* ================= SPLASH ================= */}


{vm.showSplash && (

<SplashScreen

onFinish={() => vm.setShowSplash(false)}

/>

)}





{/* ================= AI LOADING ================= */}


<AnimatePresence>

{

vm.isAIEnhancing && (

<AILoadingOverlay

progress={vm.aiProgress}

stepMessage={vm.aiStepMessage}

modeLabel={
vm.activeAIMode
.replace("_"," ")
.toUpperCase()
}

/>

)

}

</AnimatePresence>





{/* ================= AI MODAL ================= */}


<AnimatePresence>

{

vm.aiModalOpen && (

<AIEnhanceModal

photoTitle={
vm.selectedPhoto?.title || "Selected Photo"
}

onRunAIEnhancement={
vm.runAIEnhancement
}

onClose={
vm.closeAIEnhanceModal
}

/>

)

}

</AnimatePresence>





{/* ================= BEFORE AFTER ================= */}


{

vm.beforeAfterModalOpen &&
vm.lastAIResult &&
vm.selectedPhoto &&

(

<BeforeAfterSlider

beforeUrl={
vm.selectedPhoto.url
}

afterUrl={
vm.lastAIResult.enhancedImageData
}

beforeTitle="Original"

afterTitle="AI Enhanced"

beforeDimensions={
vm.lastAIResult.originalDimensions
}

afterDimensions={
vm.lastAIResult.enhancedDimensions
}

modelUsed={
vm.lastAIResult.modelUsed
}

processingTimeMs={
vm.lastAIResult.processingTimeMs
}

onApply={
vm.applyAIResultToStudio
}

onClose={
vm.closeBeforeAfterModal
}

/>

)

}



{/* ================= EXPORT MODAL ================= */}


<AnimatePresence>

{
vm.exportModalOpen &&
vm.selectedPhoto &&

(

<ExportModal

photo={vm.selectedPhoto}

adjustments={vm.adjustments}

onClose={vm.closeExportModal}

onSaveToHistory={vm.addProjectHistoryItem}

/>

)

}

</AnimatePresence>





{/* ================= RECENT PROJECTS ================= */}


<AnimatePresence>

{
vm.recentProjectsModalOpen &&

(

<RecentProjectsModal

historyItems={vm.projectHistory}

onSelectProject={vm.selectHistoryProject}

onClearHistory={vm.clearProjectHistory}

onDeleteProject={vm.deleteProjectHistoryItem}

onClose={vm.closeRecentProjectsModal}

/>

)

}

</AnimatePresence>





{/* ================= MAIN APP ================= */}


{

!vm.showSplash && (

<AndroidFrame>


{/* TOP BAR */}


<TopAppBar

vm={vm}

/>





{/* CONTENT AREA */}


<main

className="
flex-1
flex
flex-col
overflow-hidden
"

>


<AnimatePresence mode="wait">





{/* ================= HOME ================= */}


{
vm.activeTab === "home" && (

<motion.div

key="home"

initial={{
opacity:0,
x:-10
}}

animate={{
opacity:1,
x:0
}}

exit={{
opacity:0,
x:10
}}

transition={{
duration:0.2
}}

className="
flex-1
flex
flex-col
overflow-y-auto
"

>

<HomeScreen vm={vm}/>

</motion.div>

)

}





{/* ================= AI CHAT ================= */}


{
vm.activeTab === "chat" && (

<motion.div

key="chat"

initial={{
opacity:0,
x:10
}}

animate={{
opacity:1,
x:0
}}

exit={{
opacity:0,
x:-10
}}

transition={{
duration:0.2
}}

className="
flex-1
flex
flex-col
"

>

<AIChat />

</motion.div>

)

}





{/* ================= STUDIO ================= */}


{
vm.activeTab === "studio" && (

<motion.div

key="studio"

initial={{
opacity:0,
x:-10
}}

animate={{
opacity:1,
x:0
}}

exit={{
opacity:0,
x:10
}}

transition={{
duration:0.2
}}

className="
flex-1
flex
flex-col
"

>

<StudioScreen vm={vm}/>

</motion.div>

)

}





{/* ================= GALLERY ================= */}


{
vm.activeTab === "gallery" && (

<motion.div

key="gallery"

initial={{
opacity:0,
x:-10
}}

animate={{
opacity:1,
x:0
}}

exit={{
opacity:0,
x:10
}}

transition={{
duration:0.2
}}

className="
flex-1
flex
flex-col
"

>

<GalleryScreen vm={vm}/>

</motion.div>

)

}





{/* ================= SETTINGS ================= */}


{
vm.activeTab === "settings" && (

<motion.div

key="settings"

initial={{
opacity:0,
x:-10
}}

animate={{
opacity:1,
x:0
}}

exit={{
opacity:0,
x:10
}}

transition={{
duration:0.2
}}

className="
flex-1
flex
flex-col
"

>

<SettingsScreen vm={vm}/>

</motion.div>

)

}

</AnimatePresence>


</main>





{/* ================= BOTTOM NAVIGATION ================= */}


<BottomNavigation

vm={vm}

/>


</AndroidFrame>

)

}


</>

);

}
