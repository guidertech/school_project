"use client";

import React from "react";
import { motion } from "framer-motion";

export function HeroBackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. Animated Fluid Glowing Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 80, -60, 0],
          y: [0, -70, 50, 0],
          scale: [1, 1.25, 0.9, 1],
          rotate: [0, 90, 180, 360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#096145]/25 via-[#006783]/20 to-teal-200/30 blur-3xl opacity-70"
      />

      <motion.div
        animate={{
          x: [0, -90, 70, 0],
          y: [0, 80, -60, 0],
          scale: [1, 1.3, 0.95, 1],
          rotate: [360, 270, 90, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#006783]/20 via-sky-300/25 to-[#d96b43]/15 blur-3xl opacity-65"
      />

      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -40, 60, 0],
          scale: [0.9, 1.2, 1, 0.9],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-emerald-200/20 via-[#006783]/15 to-transparent blur-3xl opacity-60"
      />

      {/* 2. Geometric Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#006783_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* 3. Floating Micro Particles & Sparkles */}
      {/* Particle 1: Floating Star Burst */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/6 w-4 h-4 text-[#006783]/40"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      {/* Particle 2: Small Floating Circle */}
      <motion.div
        animate={{
          y: [0, -35, 0],
          x: [0, 15, 0],
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#096145]/30 border border-[#096145]/40"
      />

      {/* Particle 3: Floating Diamond */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [45, 225, 405],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/3 left-1/4 w-3.5 h-3.5 border-2 border-[#d96b43]/30 rounded-xs"
      />

      {/* Particle 4: Small Sparkle */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          scale: [0.8, 1.3, 0.8],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-1/4 right-1/6 w-4 h-4 text-amber-500/40"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>
    </div>
  );
}
