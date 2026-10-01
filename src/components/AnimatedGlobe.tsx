"use client";

import React, { useEffect, useRef } from "react";

export function AnimatedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let rotationAngle = 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Globe parameters
    const latLines = 14;
    const longLines = 18;
    const tiltAngle = (23.5 * Math.PI) / 180; // Earth axial tilt (~23.5 deg)
    const sinTilt = Math.sin(tiltAngle);
    const cosTilt = Math.cos(tiltAngle);

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!prefersReducedMotion) {
        // ~28 seconds per full 360 rotation (2 * PI rad)
        rotationAngle += (2 * Math.PI / 28) * delta;
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Dynamic radius scaling based on container dimension (responsive)
      const minDim = Math.min(width, height);
      const radius = Math.min(Math.max(minDim * 0.42, 160), 340);

      // Vibrant colors with high contrast for light theme
      const primaryColor = "0, 0, 0"; // rgba(18, 93, 233, 1) deep emerald
      const secondaryColor = "9, 97, 59"; // #1481f5ff rich cyan/teal

      // 3D Point Rotation & Projection Helper
      const project = (lat: number, lon: number) => {
        // Spherical coordinates
        const x0 = radius * Math.cos(lat) * Math.sin(lon + rotationAngle);
        const y0 = radius * Math.sin(lat);
        const z0 = radius * Math.cos(lat) * Math.cos(lon + rotationAngle);

        // Apply axial tilt around Z axis
        const x = x0 * cosTilt - y0 * sinTilt;
        const y = x0 * sinTilt + y0 * cosTilt;
        const z = z0;

        return {
          px: centerX + x,
          py: centerY - y,
          z: z,
        };
      };

      ctx.lineWidth = 1.8;

      // 1. Draw Latitude Lines (Parallels)
      for (let i = 1; i < latLines; i++) {
        const lat = -Math.PI / 2 + (Math.PI * i) / latLines;
        ctx.beginPath();

        let started = false;
        const segments = 72;

        for (let j = 0; j <= segments; j++) {
          const lon = (2 * Math.PI * j) / segments;
          const pt = project(lat, lon);

          // Only draw visible front-facing mesh or semi-transparent back mesh
          if (pt.z > -radius * 0.35) {
            const alphaFactor = Math.max(0.2, (pt.z + radius) / (2 * radius));
            ctx.strokeStyle = `rgba(${primaryColor}, ${0.75 * alphaFactor})`;

            if (!started) {
              ctx.moveTo(pt.px, pt.py);
              started = true;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 2. Draw Longitude Lines (Meridians)
      for (let i = 0; i < longLines; i++) {
        const lon = (2 * Math.PI * i) / longLines;
        ctx.beginPath();

        let started = false;
        const segments = 72;

        for (let j = 0; j <= segments; j++) {
          const lat = -Math.PI / 2 + (Math.PI * j) / segments;
          const pt = project(lat, lon);

          if (pt.z > -radius * 0.35) {
            const alphaFactor = Math.max(0.2, (pt.z + radius) / (2 * radius));
            ctx.strokeStyle = `rgba(${secondaryColor}, ${0.75 * alphaFactor})`;

            if (!started) {
              ctx.moveTo(pt.px, pt.py);
              started = true;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 3. Draw Outer Wireframe Rim & Glowing Halo
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(${primaryColor}, 0.8)`;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Outer atmosphere glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.8,
        centerX,
        centerY,
        radius * 1.2
      );
      glowGrad.addColorStop(0, `rgba(${secondaryColor}, 0.25)`);
      glowGrad.addColorStop(0.5, `rgba(${primaryColor}, 0.15)`);
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, 2 * Math.PI);
      ctx.fill();

      // 4. Mesh Node Dots
      const dotLatStep = Math.PI / 6;
      const dotLonStep = Math.PI / 6;

      for (let lat = -Math.PI / 3; lat <= Math.PI / 3; lat += dotLatStep) {
        for (let lon = 0; lon < 2 * Math.PI; lon += dotLonStep) {
          const pt = project(lat, lon);
          if (pt.z > 0) {
            const dotSize = 1.8 + (pt.z / radius) * 1.5;
            const dotAlpha = 0.3 + (pt.z / radius) * 0.6;
            ctx.fillStyle = `rgba(${primaryColor}, ${dotAlpha})`;
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, dotSize, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[700px] h-[550px] sm:h-[650px] pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-70 md:opacity-80 transition-opacity duration-500"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
