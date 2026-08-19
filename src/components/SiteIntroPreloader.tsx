"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export function SiteIntroPreloader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  const brandLetters = ["G", "U", "I", "D", "E", "R"];

  useEffect(() => {
    // Check if preloader has already played during this session
    if (typeof window !== "undefined" && sessionStorage.getItem("hasSeenIntro")) {
      setIsLoaded(true);
      return;
    }

    const container = containerRef.current;
    const textContainer = textRef.current;
    const counterEl = counterRef.current;
    const subtitleEl = subtitleRef.current;

    if (!container || !textContainer || !counterEl) return;

    // Prevent scrolling while intro is playing
    document.body.style.overflow = "hidden";

    const letters = textContainer.querySelectorAll(".intro-letter");
    const countObj = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "auto";
        if (typeof window !== "undefined") {
          sessionStorage.setItem("hasSeenIntro", "true");
        }
        setIsLoaded(true);
      },
    });

    // 1. Initial State: Hide all letters completely
    gsap.set(letters, { y: 150, opacity: 0, scale: 0.6, rotateX: 60 });

    // 2. Animate Counter 0 -> 100%
    tl.to(countObj, {
      value: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterEl) {
          counterEl.textContent = `${Math.floor(countObj.value)}%`;
        }
      },
    });

    // 3. One-by-One Sequential Letter Reveal (G -> U -> I -> D -> E -> R)
    tl.to(
      letters,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 0.45,
        stagger: 0.28, // Clear delay between each letter
        ease: "back.out(1.8)",
      },
      0.2 // Starts at 0.2s so letters pop one-by-one while counting!
    );

    // 4. Subtitle Fade In after all letters appear
    if (subtitleEl) {
      tl.fromTo(
        subtitleEl,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
    }

    // 5. Hold moment then Curtain Slide-Up Reveal
    tl.to(container, {
      y: "-100%",
      duration: 1.1,
      ease: "power4.inOut",
      delay: 0.4,
    });
  }, []);

  if (isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[#006783] text-white flex flex-col justify-between p-8 md:p-14 select-none"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs font-mono tracking-widest text-teal-200 uppercase opacity-80">
        <span>GUIDER PLATFORM</span>
        <span>Est. 2026</span>
      </div>

      {/* Center Typography Reveal */}
      <div className="my-auto text-center overflow-hidden py-6">
        <div
          ref={textRef}
          className="flex items-center justify-center gap-2 sm:gap-4 text-6xl sm:text-8xl md:text-9xl font-extrabold font-heading tracking-tighter"
          style={{ perspective: "1000px" }}
        >
          {brandLetters.map((letter, idx) => (
            <div key={idx} className="overflow-hidden inline-block py-2">
              <span className="intro-letter inline-block transform-gpu text-white drop-shadow-2xl">
                {letter}
              </span>
            </div>
          ))}
        </div>

        <div ref={subtitleRef} className="mt-4 opacity-0">
          <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-teal-100 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
            AI-Powered Digital Teaching Platform
          </span>
        </div>
      </div>

      {/* Bottom Counter */}
      <div className="flex items-end justify-between font-mono">
        <div className="text-xs text-teal-200/70 max-w-xs hidden sm:block">
          Loading digital classroom interactive modules...
        </div>
        <div className="text-4xl sm:text-6xl font-extrabold text-amber-300">
          <span ref={counterRef}>0%</span>
        </div>
      </div>
    </div>
  );
}
