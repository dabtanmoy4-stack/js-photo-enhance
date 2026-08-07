import React, { useState } from "react";
import {
  Menu,
  Search,
  X,
  Sparkles,
  Settings,
  Bell,
} from "lucide-react";

import { AppViewModel } from "../viewmodel/useAppViewModel";
import { JSLogo } from "./JSLogo";


interface TopAppBarProps {
  vm: AppViewModel;
}


export const TopAppBar: React.FC<TopAppBarProps> = ({ vm }) => {

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);


  const handleSearch = () => {
    if (!searchText.trim()) return;

    console.log("Searching:", searchText);

    // Future:
    // vm.searchAI(searchText)
  };


  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        backdrop-blur-xl
        bg-[#090014]/80
        border-b
        border-violet-500/20
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          py-3
          flex
          items-center
          justify-between
        "
      >

        {/* LEFT SECTION */}

        <div className="flex items-center gap-3">


          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              md:hidden
              p-2
              rounded-xl
              hover:bg-white/10
              transition
            "
          >

            {
              menuOpen
              ?
              <X size={22}/>
              :
              <Menu size={22}/>
            }

          </button>



          <JSLogo />


          <div className="hidden sm:block">

            <h1
              className="
                text-lg
                font-bold
                text-white
                flex
                items-center
                gap-2
              "
            >

              JS AI Assistant

              <Sparkles
                size={16}
                className="text-violet-400"
              />

            </h1>


            <p
              className="
                text-xs
                text-gray-400
              "
            >
              AI Workspace
            </p>


          </div>


        </div>
                {/* CENTER SEARCH SECTION */}

        <div
          className="
            hidden
            md:flex
            flex-1
            justify-center
            px-6
          "
        >

          <div
            className="
              relative
              w-full
              max-w-md
            "
          >

            {/* Animated Glow Border */}

            <div
              className="
                absolute
                -inset-[1px]
                rounded-xl
                bg-gradient-to-r
                from-violet-500
                via-fuchsia-500
                to-purple-500
                opacity-40
                blur
              "
            />


            <div
              className="
                relative
                flex
                items-center
                bg-black/40
                border
                border-violet-400/20
                rounded-xl
                px-3
                py-2
              "
            >

              <Search
                size={18}
                className="
                  text-violet-300
                  mr-2
                "
              />


              <input
                value={searchText}
                onChange={(e)=>setSearchText(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.key==="Enter"){
                    handleSearch();
                  }
                }}
                placeholder="
                  Search AI tools, images, projects...
                "
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-sm
                  text-white
                  placeholder:text-gray-500
                "
              />


              {
                searchText && (

                  <button
                    onClick={()=>setSearchText("")}
                    className="
                      p-1
                      rounded-full
                      hover:bg-white/10
                    "
                  >

                    <X
                      size={15}
                      className="text-gray-400"
                    />

                  </button>

                )
              }


            </div>

          </div>

        </div>
                {/* RIGHT SECTION */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >


          {/* Mobile Search Button */}

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="
              md:hidden
              p-2
              rounded-xl
              hover:bg-white/10
              transition
            "
          >

            {
              searchOpen
              ?
              <X size={20}/>
              :
              <Search size={20}/>
            }

          </button>



          {/* Notification Button */}

          <button
            className="
              hidden
              sm:flex
              relative
              p-2
              rounded-xl
              hover:bg-white/10
              transition
            "
          >

            <Bell
              size={20}
              className="
                text-gray-300
              "
            />


            {/* Notification Dot */}

            <span
              className="
                absolute
                top-1
                right-1
                w-2
                h-2
                rounded-full
                bg-violet-500
              "
            />

          </button>




          {/* Settings Button */}

          <button
            onClick={() => vm.setView?.("settings")}
            className="
              p-2
              rounded-xl
              hover:bg-white/10
              transition
            "
          >

            <Settings
              size={20}
              className="
                text-gray-300
              "
            />

          </button>


        </div>


      </div>
            
      {/* MOBILE SEARCH */}

      {
        searchOpen && (

          <div
            className="
              md:hidden
              px-4
              pb-3
            "
          >

            <div
              className="
                relative
                flex
                items-center
                bg-white/5
                border
                border-violet-500/20
                rounded-xl
                px-3
                py-2
              "
            >

              <Search
                size={18}
                className="
                  text-violet-300
                  mr-2
                "
              />


              <input

                autoFocus

                value={searchText}

                onChange={(e)=>
                  setSearchText(e.target.value)
                }

                onKeyDown={(e)=>{

                  if(e.key==="Enter"){
                    handleSearch();
                  }

                }}

                placeholder="
                  Search AI Workspace...
                "

                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-sm
                  text-white
                  placeholder:text-gray-500
                "

              />


            </div>


          </div>

        )
      }




      {/* MOBILE MENU */}

      {
        menuOpen && (

          <div
            className="
              md:hidden
              px-4
              pb-4
            "
          >

            <div
              className="
                rounded-2xl
                bg-[#120021]
                border
                border-violet-500/20
                p-4
                space-y-2
              "
            >


              <button
                onClick={() =>
                  vm.setView?.("home")
                }
                className="
                  w-full
                  text-left
                  px-3
                  py-2
                  rounded-xl
                  text-gray-200
                  hover:bg-white/10
                  transition
                "
              >

                🏠 Home

              </button>



              <button
                onClick={() =>
                  vm.setView?.("studio")
                }
                className="
                  w-full
                  text-left
                  px-3
                  py-2
                  rounded-xl
                  text-gray-200
                  hover:bg-white/10
                  transition
                "
              >

                ✨ AI Image Studio

              </button>



              <button
                onClick={() =>
                  vm.setView?.("gallery")
                }
                className="
                  w-full
                  text-left
                  px-3
                  py-2
                  rounded-xl
                  text-gray-200
                  hover:bg-white/10
                  transition
                "
              >

                🖼 AI Gallery

              </button>



              <button
                onClick={() =>
                  vm.setView?.("settings")
                }
                className="
                  w-full
                  text-left
                  px-3
                  py-2
                  rounded-xl
                  text-gray-200
                  hover:bg-white/10
                  transition
                "
              >

                ⚙ Settings

              </button>


            </div>


          </div>

        )
      }
      
      {/* AI STATUS BAR */}

      <div
        className="
          hidden
          sm:flex
          items-center
          justify-center
          gap-2
          py-1
          border-t
          border-violet-500/10
          bg-black/20
        "
      >

        <span
          className="
            w-2
            h-2
            rounded-full
            bg-green-400
            animate-pulse
          "
        />


        <p
          className="
            text-xs
            text-gray-400
          "
        >
          AI Engine Online • Ready
        </p>


      </div>



      {/* BOTTOM GLOW LINE */}

      <div
        className="
          h-[1px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-violet-500/60
          to-transparent
        "
      />

    </header>

  );

};