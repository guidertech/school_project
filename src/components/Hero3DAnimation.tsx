"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, GraduationCap, Zap, Award } from "lucide-react";

export function Hero3DAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none perspective-1000">
      {/* 1. Ambient 3D Glowing Gradient Spheres */}
      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -50, 30, 0],
          rotate: [0, 120, 240, 360],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-16 -left-16 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#006783]/30 via-[#096145]/20 to-sky-300/30 blur-3xl opacity-75"
      />

      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 60, -40, 0],
          rotate: [360, 240, 120, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-16 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#006783]/25 via-emerald-300/20 to-[#d96b43]/15 blur-3xl opacity-70"
      />

      {/* 2. 3D Floating Glassmorphic Badges (Left Side) */}
      {/* 3D Badge 1 */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -14, 0],
          rotateX: [5, -5, 5],
          rotateY: [-10, 10, -10],
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotateX: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          duration: 0.8,
        }}
        className="hidden lg:flex absolute top-36 left-12 xl:left-24 z-10 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_15px_35px_rgba(0,103,131,0.12)] text-slate-800 font-bold text-xs"
      >


      </motion.div>

      {/* 3D Badge 2 */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -18, 0],
          rotateX: [-8, 8, -8],
          rotateY: [8, -8, 8],
        }}
        transition={{
          y: { duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
          rotateX: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          duration: 0.8,
        }}
        className="hidden lg:flex absolute bottom-36 left-16 xl:left-28 z-10 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_15px_35px_rgba(9,97,69,0.12)] text-slate-800 font-bold text-xs"
      >

      </motion.div>

      {/* 3. 3D Floating Glassmorphic Badges (Right Side) */}
      {/* 3D Badge 3 */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -16, 0],
          rotateX: [6, -6, 6],
          rotateY: [10, -10, 10],
        }}
        transition={{
          y: { duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          rotateX: { duration: 7.2, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 8.5, repeat: Infinity, ease: "easeInOut" },
          duration: 0.8,
        }}
        className="hidden lg:flex absolute top-36 right-12 xl:right-24 z-10 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_15px_35px_rgba(217,107,67,0.12)] text-slate-800 font-bold text-xs"
      >

      </motion.div>

      {/* 3D Badge 4 */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -20, 0],
          rotateX: [-10, 10, -10],
          rotateY: [-6, 6, -6],
        }}
        transition={{
          y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
          rotateX: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          duration: 0.8,
        }}
        className="hidden lg:flex absolute bottom-36 right-16 xl:right-28 z-10 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_15px_35px_rgba(0,103,131,0.12)] text-slate-800 font-bold text-xs"
      >

      </motion.div>

      {/* 4. 3D Floating Geometry Spheres */}
      {/* 3D Sphere 1 */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          x: [0, 10, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-10 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-300 via-[#096145] to-teal-900 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.3),0_10px_20px_rgba(9,97,69,0.25)] opacity-40"
      />

      {/* 3D Sphere 2 */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, -12, 0],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-10 w-12 h-12 rounded-full bg-gradient-to-br from-sky-300 via-[#006783] to-slate-900 shadow-[inset_-5px_-5px_12px_rgba(0,0,0,0.35),0_12px_24px_rgba(0,103,131,0.25)] opacity-45"
      />
    </div>
  );
}
