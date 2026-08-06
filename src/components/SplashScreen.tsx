/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion, useAnimation } from "motion/react";

import Robot from "./Robot";
import { JSLogo } from "./JSLogo";


interface SplashScreenProps {
  onFinish?: () => void;
}


export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
}) => {

  const controls = useAnimation();


  useEffect(() => {

    const startAnimation = async () => {

      await controls.start({
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.8,
          ease: "easeOut",
        },
      });


      setTimeout(() => {

        if (onFinish) {
          onFinish();
        }

      }, 2500);

    };


    startAnimation();

  }, [controls, onFinish]);



  return (

    <motion.div

      initial={{
        opacity: 0,
        scale: 0.95,
      }}

      animate={controls}

      exit={{
        opacity: 0,
        scale: 1.05,
        transition:{
          duration:0.5,
        },
      }}

      className="
        fixed
        inset-0
        overflow-hidden
        bg-gradient-to-br
        from-[#13051F]
        via-[#1B0830]
        to-[#2A0A45]
        text-white
        flex
        flex-col
        items-center
        justify-between
        p-8
      "

    >


      {/* Background Glow */}

      <motion.div

        animate={{
          scale:[1,1.2,1],
          opacity:[0.3,0.6,0.3],
        }}

        transition={{
          duration:4,
          repeat:Infinity,
        }}

        className="
          absolute
          w-[500px]
          h-[500px]
          rounded-full
          bg-violet-600/20
          blur-3xl
          top-[-150px]
        "

      />



      {/* Logo Section */}

      <motion.div

        initial={{
          opacity:0,
          y:-40,
        }}

        animate={{
          opacity:1,
          y:0,
        }}

        transition={{
          duration:0.8,
        }}

        className="
          relative
          z-10
          flex
          flex-col
          items-center
          mt-8
        "

      >


        <div

          className="
            w-28
            h-28
            rounded-3xl
            bg-white/10
            backdrop-blur-xl
            border
            border-white/20
            flex
            items-center
            justify-center
            shadow-2xl
          "

        >

          <JSLogo />

        </div>



      </motion.div>



      {/* Robot Section Start */}

      <motion.div

        initial={{
          opacity:0,
          y:40,
        }}

        animate={{
          opacity:1,
          y:0,
        }}

        transition={{
          delay:0.5,
          duration:0.8,
        }}

        className="
          relative
          z-10
          flex
          flex-1
          items-center
          justify-center
        "

      >


        <div

          className="
            relative
            w-72
            h-72
            flex
            items-center
            justify-center
          "

        >
          {/* Robot Glow */}

          <motion.div

            animate={{
              rotate:360,
            }}

            transition={{
              duration:12,
              repeat:Infinity,
              ease:"linear",
            }}

            className="
              absolute
              inset-0
              rounded-full
              border
              border-violet-400/30
            "

          />



          <motion.div

            animate={{
              scale:[1,1.08,1],
              opacity:[0.3,0.6,0.3],
            }}

            transition={{
              duration:3,
              repeat:Infinity,
            }}

            className="
              absolute
              w-56
              h-56
              rounded-full
              bg-violet-500/20
              blur-3xl
            "

          />



          <Robot />


        </div>


      </motion.div>




      {/* Brand Name */}


      <motion.div

        initial={{
          opacity:0,
          y:20,
        }}

        animate={{
          opacity:1,
          y:0,
        }}

        transition={{
          delay:1,
          duration:0.8,
        }}

        className="
          relative
          z-10
          flex
          flex-col
          items-center
          mb-10
        "

      >


        <h1

          className="
            text-4xl
            font-black
            tracking-wide
            bg-gradient-to-r
            from-white
            via-violet-200
            to-purple-400
            bg-clip-text
            text-transparent
          "

        >

          JS AI Hub

        </h1>



        <p

          className="
            mt-3
            text-sm
            tracking-[0.35em]
            text-zinc-300
            uppercase
          "

        >

          MADE BY INDIA 🇮🇳

        </p>



      </motion.div>



    </motion.div>

  );

};
