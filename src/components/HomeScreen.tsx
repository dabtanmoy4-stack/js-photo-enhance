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





</div>



</div>


</motion.div>
{/* ================= AI TOOLS ================= */}


<div
  className="
    grid
    gap-5
    [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]
  "
>


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
ai-tool-card
p-5
transition-all
duration-300
hover:scale-[1.03]
hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]
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


</div>

);

};