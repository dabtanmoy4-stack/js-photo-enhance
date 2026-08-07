import React from "react";
import { motion } from "motion/react";

import { AppViewModel } from "../viewmodel/useAppViewModel";
import { JSLogo } from "./JSLogo";

import {
  Upload,
  Bot,
  Zap,
  Sparkles,
  Video,
  Music4,
  Code2,
  Smartphone,
  Languages,
  ShieldCheck,
} from "lucide-react";
interface HomeScreenProps {
  vm: AppViewModel;
}


export const HomeScreen: React.FC<HomeScreenProps> = ({ vm }) => {

return (

<div className="flex flex-col gap-6">


{/* ================= HERO ================= */}


<motion.div

initial={{ opacity:0, y:20 }}

animate={{ opacity:1, y:0 }}

className="
relative
overflow-hidden
rounded-3xl
border
border-violet-500/30
bg-gradient-to-br
from-zinc-900
via-black
to-zinc-950
p-6
shadow-xl
"

>


<div
className="
absolute
right-0
top-0
h-52
w-52
rounded-full
bg-violet-500/20
blur-3xl
"
/>



<div className="relative z-10">


<div className="flex items-center justify-between">


<JSLogo size="md" />


<span
className="
flex
items-center
gap-1
rounded-full
border
border-violet-500/40
bg-violet-500/20
px-3
py-1
text-xs
font-bold
text-violet-300
"
>

<Zap className="h-3 w-3" />

READY

</span>


</div>



<div className="mt-6">


<h1
className="
text-3xl
font-black
text-white
"
>

Your Ultimate


<span
className="
block
bg-gradient-to-r
from-violet-400
to-fuchsia-400
bg-clip-text
text-transparent
"
>

AI Workspace

</span>


</h1>



<p
className="
mt-3
text-sm
leading-relaxed
text-zinc-300
"
>

Chat, create, enhance and edit your photos with powerful AI.
Everything you need is available from one modern workspace.

</p>


</div>



<div
className="
mt-6
flex
flex-col
gap-3
sm:flex-row
"
>


{/* AI CHAT BUTTON */}


<button

onClick={() => vm.setActiveTab("chat")}

className="
flex-1
rounded-xl
bg-gradient-to-r
from-violet-600
to-fuchsia-600
px-4
py-3
text-sm
font-bold
text-white
transition
hover:scale-[1.02]
"

>


<span
className="
flex
items-center
justify-center
gap-2
"
>

<Bot className="h-4 w-4"/>

AI Chat

</span>


</button>



{/* IMPORT BUTTON */}


<label

className="
cursor-pointer
rounded-xl
border
border-zinc-700
bg-zinc-900
px-4
py-3
text-sm
font-bold
text-white
hover:bg-zinc-800
"

>


<span
className="
flex
items-center
justify-center
gap-2
"
>

<Upload className="h-4 w-4 text-violet-400"/>

Import Photo

</span>


<input

type="file"

accept="image/*"

className="hidden"

onChange={(e)=>{

if(e.target.files?.[0]){

vm.uploadPhoto(e.target.files[0]);

}

}}

/>


</label>


</div>



</div>


</motion.div>
{/* ================= AI TOOLS ================= */}


<div
className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-4
"
>


{/* JS IMAGE STUDIO */}

<button

onClick={() => vm.openAIEnhanceModal("image_studio")}

className="
relative
overflow-hidden
rounded-2xl
border
border-violet-500/30
bg-zinc-900
p-1
transition
hover:scale-[1.03]
"

>


<div
className="
absolute
inset-0
bg-gradient-to-r
from-violet-600
via-fuchsia-500
to-violet-600
opacity-40
"
/>


<div
className="
relative
rounded-2xl
bg-zinc-950
p-5
"
>


<div
className="
mb-4
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-violet-500/20
"
>

<Sparkles className="h-6 w-6 text-violet-400"/>

</div>


<h3
className="
text-sm
font-bold
text-white
"
>
JS Image Studio
</h3>


<p
className="
mt-1
text-xs
text-zinc-400
"
>
AI Photo Enhance
</p>


</div>


</button>





{/* IMAGE AI */}

{[
{
name:"Image AI",
icon:Sparkles
},
{
name:"JS AI Video",
icon:Video
},
{
name:"JS AI Music",
icon:Music4
},
{
name:"JS AI Code",
icon:Code2
},
{
name:"JS AI App Builder",
icon:Smartphone
},
{
name:"JS AI Translator",
icon:Languages
},
{
name:"JS AI Writer",
icon:Bot
}

].map((tool,index)=>{


const Icon = tool.icon;


return (

<button

key={index}

onClick={() =>
vm.showToast(`${tool.name} - Coming Soon`)
}

className="
relative
overflow-hidden
rounded-2xl
border
border-violet-500/30
bg-zinc-900
p-5
transition
hover:scale-[1.03]
"

>


<div
className="
mb-4
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-violet-500/20
"
>

<Icon
className="
h-6
w-6
text-violet-400
"
/>

</div>


<h3
className="
text-sm
font-bold
text-white
"
>

{tool.name}

</h3>


<p
className="
mt-1
text-xs
text-zinc-400
"
>

Coming Soon

</p>


</button>


)


})}


</div>
{/* ================= AI SYSTEM STATUS ================= */}


<motion.div

initial={{opacity:0,y:20}}

animate={{opacity:1,y:0}}

transition={{delay:0.2}}

className="
rounded-2xl
border
border-violet-500/30
bg-gradient-to-br
from-zinc-900
to-[#1A0B2E]
p-5
"

>


<div
className="
flex
items-center
justify-between
mb-5
"
>


<h2
className="
flex
items-center
gap-2
text-sm
font-bold
text-white
"
>

<ShieldCheck
className="
h-5
w-5
text-violet-400
"
/>

AI System Status

</h2>



<span
className="
rounded-full
bg-green-500/20
px-3
py-1
text-[10px]
font-bold
text-green-400
"
>

ONLINE

</span>


</div>




<div
className="
grid
grid-cols-2
gap-3
"
>



<div
className="
rounded-xl
border
border-zinc-800
bg-black/40
p-4
"
>

<p
className="
text-xs
text-zinc-400
"
>
AI Engine
</p>


<p
className="
mt-1
text-sm
font-bold
text-violet-300
"
>

JS AI Hub

</p>


</div>





<div
className="
rounded-xl
border
border-zinc-800
bg-black/40
p-4
"
>


<p
className="
text-xs
text-zinc-400
"
>

Status

</p>


<p
className="
mt-1
text-sm
font-bold
text-green-400
"
>

Ready

</p>


</div>






<div
className="
rounded-xl
border
border-zinc-800
bg-black/40
p-4
"
>


<p
className="
text-xs
text-zinc-400
"
>

Projects

</p>


<p
className="
mt-1
text-sm
font-bold
text-white
"
>

{vm.projectHistory.length}

</p>


</div>






<div
className="
rounded-xl
border
border-zinc-800
bg-black/40
p-4
"
>


<p
className="
text-xs
text-zinc-400
"
>

Photos

</p>


<p
className="
mt-1
text-sm
font-bold
text-white
"
>

{vm.photos.length}

</p>


</div>




</div>


</motion.div>
// ================= END =================


</div>

);

};