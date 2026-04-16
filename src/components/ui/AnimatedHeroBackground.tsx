"use client";

import { useEffect, useRef } from "react";

/**
 * Layered animated background for the hero:
 *   1. Deep navy gradient base
 *   2. Ambient gradient mesh (breathing blobs)
 *   3. Blueprint grid with radial fade
 *   4. Mouse-parallax floating triangles
 *   5. Pulsing network nodes
 *   6. Noise overlay
 */
export default function AnimatedHeroBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedRef.current) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function onMove(e: MouseEvent) {
      const rect = layerRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Normalize to [-1, 1] within the hero area
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function tick() {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const layer = layerRef.current;
      if (layer) {
        const tri1 = layer.querySelector<HTMLElement>("[data-parallax='1']");
        const tri2 = layer.querySelector<HTMLElement>("[data-parallax='2']");
        const tri3 = layer.querySelector<HTMLElement>("[data-parallax='3']");
        if (tri1) tri1.style.transform = `translate3d(${currentX * 24}px, ${currentY * 24}px, 0)`;
        if (tri2) tri2.style.transform = `translate3d(${currentX * -16}px, ${currentY * -16}px, 0)`;
        if (tri3) tri3.style.transform = `translate3d(${currentX * 10}px, ${currentY * 18}px, 0)`;
      }

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    }

    const el = layerRef.current;
    el?.addEventListener("mousemove", onMove);
    return () => {
      el?.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 overflow-hidden noise"
      aria-hidden="true"
    >
      {/* Layer 1: Deep base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, var(--color-navy-light) 0%, var(--color-navy-900) 50%, var(--color-navy-950) 100%)",
        }}
      />

      {/* Layer 2: Breathing gradient mesh blobs */}
      <div
        className="absolute -right-[10%] top-[-10%] h-[60vh] w-[60vh] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)",
          filter: "blur(60px)",
          animation: "mesh-breathe 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[-15%] top-[30%] h-[50vh] w-[50vh] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 60%)",
          filter: "blur(70px)",
          animation: "mesh-breathe 16s ease-in-out infinite 2s",
        }}
      />
      <div
        className="absolute right-[5%] bottom-[-10%] h-[40vh] w-[40vh] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 60%)",
          filter: "blur(80px)",
          animation: "mesh-breathe 14s ease-in-out infinite 4s",
        }}
      />

      {/* Layer 3: Blueprint grid with radial fade */}
      <div className="absolute inset-0 bg-grid mask-radial-fade opacity-60" />

      {/* Layer 4: Mouse-parallax triangle cluster (right side) */}
      <svg
        className="absolute right-0 top-0 h-full w-1/2"
        viewBox="0 0 600 600"
        fill="none"
        preserveAspectRatio="xMaxYMid slice"
      >
        <defs>
          <linearGradient id="triGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="triGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Large anchoring triangles */}
        <g style={{ animation: "drift-1 18s ease-in-out infinite" }} data-parallax="1">
          <polygon points="400,100 560,280 400,280" fill="url(#triGrad1)" />
          <polygon points="460,180 540,260 460,260" fill="url(#triGrad2)" />
        </g>

        {/* Medium triangles */}
        <g style={{ animation: "drift-2 22s ease-in-out infinite" }} data-parallax="2">
          <polygon points="320,220 400,300 320,300" fill="#22D3EE" opacity="0.5" />
          <polygon points="500,340 580,420 500,420" fill="#60A5FA" opacity="0.6" />
          <polygon points="380,420 440,480 380,480" fill="#3B82F6" opacity="0.45" />
        </g>

        {/* Small detail triangles */}
        <g style={{ animation: "drift-3 26s ease-in-out infinite" }} data-parallax="3">
          <polygon points="440,60 480,100 440,100" fill="#FFFFFF" opacity="0.35" />
          <polygon points="540,160 570,190 540,190" fill="#22D3EE" opacity="0.55" />
          <polygon points="350,360 380,390 350,390" fill="#FFFFFF" opacity="0.25" />
          <polygon points="280,140 310,170 280,170" fill="#60A5FA" opacity="0.4" />
          <polygon points="560,460 590,490 560,490" fill="#06B6D4" opacity="0.5" />
        </g>
      </svg>

      {/* Layer 5: Pulsing network nodes (left/center — subtle) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Connecting lines */}
        <g stroke="#60A5FA" strokeWidth="0.5" opacity="0.25">
          <line x1="120" y1="180" x2="280" y2="320" />
          <line x1="280" y1="320" x2="180" y2="520" />
          <line x1="180" y1="520" x2="360" y2="620" />
          <line x1="360" y1="620" x2="480" y2="440" />
          <line x1="480" y1="440" x2="280" y2="320" />
        </g>
        {/* Pulsing nodes */}
        <g fill="#22D3EE">
          <circle cx="120" cy="180" r="3" style={{ animation: "pulse-node 3s ease-in-out infinite" }} />
          <circle cx="280" cy="320" r="4" style={{ animation: "pulse-node 3s ease-in-out infinite 0.5s" }} />
          <circle cx="180" cy="520" r="3" style={{ animation: "pulse-node 3s ease-in-out infinite 1s" }} />
          <circle cx="360" cy="620" r="3.5" style={{ animation: "pulse-node 3s ease-in-out infinite 1.5s" }} />
          <circle cx="480" cy="440" r="3" style={{ animation: "pulse-node 3s ease-in-out infinite 2s" }} />
        </g>
      </svg>
    </div>
  );
}
