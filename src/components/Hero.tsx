"use client";

import React from "react";
import SplitText from "./animation/SplitText";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <div className="min-h-screen justify-center items-center flex flex-col gap-4">
      <SplitText
        text="Hey, I'm Favour"
        className="text-6xl md:text-8xl font-bold text-center p-4"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
      />
      <h1 className="text-8xl font-bold text-center"></h1>
      <p className="text-center max-w-xl mx-auto">
        I write about code, creativity, travel, and everything in between. Come
        explore my thoughts and projects.
      </p>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer">
        <span className="text-sm text-gray-500 mb-1">Scroll down</span>
        <motion.button
          initial={{ y: 0 }}
          animate={{ y: 16 }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          aria-label="Scroll down"
          className="rounded-full p-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer"
          
        >
          <ArrowDown size={22} />
        </motion.button>
      </div>
    </div>
  );
}
