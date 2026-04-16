"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Layered animated background for the hero:
 *   1. Deep navy gradient base
 *   2. Ambient gradient mesh (breathing blobs)
 *   3. Blueprint grid with radial fade
 *   4. Mouse-parallax triangle cluster with an "explode" entrance —
 *      triangles start tightly clustered (echoing the original Wix layout),
 *      then burst outward with staggered springs, then drift ambiently.
 *   5. Pulsing network nodes
 *   6. Noise overlay
 */

/**
 * Each triangle carries:
 *  - `points` — its SVG polygon shape
 *  - `centroid` — approx center, used to compute the delta to the cluster origin
 *  - `delay` — when its explode begins
 *  - `driftMs`, `driftAmp` — drift behavior after the explode settles
 *  - `fill` — color
 */
interface Triangle {
  id: string;
  points: string;
  centroid: [number, number];
  delay: number;
  driftMs: number;
  driftAmp: number;
  fill: string;
  opacity?: number;
  rotateFrom?: number;
}

// The Wix-style cluster origin (in SVG coords, viewBox 0 0 600 600).
// Triangles start here, then explode out to their rendered position.
const CLUSTER = { x: 485, y: 185 };

const TRIANGLES: Triangle[] = [
  // Anchoring large triangles — arrive last, feel heavy
  {
    id: "L1",
    points: "400,100 560,280 400,280",
    centroid: [453, 220],
    delay: 0.55,
    driftMs: 18000,
    driftAmp: 14,
    fill: "url(#triGrad1)",
  },
  {
    id: "L2",
    points: "460,180 540,260 460,260",
    centroid: [487, 233],
    delay: 0.5,
    driftMs: 18000,
    driftAmp: 14,
    fill: "url(#triGrad2)",
  },

  // Medium triangles
  {
    id: "M1",
    points: "320,220 400,300 320,300",
    centroid: [347, 273],
    delay: 0.32,
    driftMs: 22000,
    driftAmp: 18,
    fill: "#22D3EE",
    opacity: 0.5,
  },
  {
    id: "M2",
    points: "500,340 580,420 500,420",
    centroid: [527, 393],
    delay: 0.38,
    driftMs: 22000,
    driftAmp: 18,
    fill: "#60A5FA",
    opacity: 0.6,
  },
  {
    id: "M3",
    points: "380,420 440,480 380,480",
    centroid: [400, 460],
    delay: 0.42,
    driftMs: 22000,
    driftAmp: 18,
    fill: "#3B82F6",
    opacity: 0.45,
  },

  // Small detail triangles — arrive first, light and quick
  {
    id: "S1",
    points: "440,60 480,100 440,100",
    centroid: [453, 87],
    delay: 0.05,
    driftMs: 26000,
    driftAmp: 12,
    fill: "#FFFFFF",
    opacity: 0.35,
    rotateFrom: 45,
  },
  {
    id: "S2",
    points: "540,160 570,190 540,190",
    centroid: [550, 180],
    delay: 0.1,
    driftMs: 26000,
    driftAmp: 12,
    fill: "#22D3EE",
    opacity: 0.55,
  },
  {
    id: "S3",
    points: "350,360 380,390 350,390",
    centroid: [360, 380],
    delay: 0.15,
    driftMs: 26000,
    driftAmp: 12,
    fill: "#FFFFFF",
    opacity: 0.25,
    rotateFrom: -30,
  },
  {
    id: "S4",
    points: "280,140 310,170 280,170",
    centroid: [290, 160],
    delay: 0.2,
    driftMs: 26000,
    driftAmp: 14,
    fill: "#60A5FA",
    opacity: 0.4,
    rotateFrom: 60,
  },
  {
    id: "S5",
    points: "560,460 590,490 560,490",
    centroid: [570, 480],
    delay: 0.25,
    driftMs: 26000,
    driftAmp: 12,
    fill: "#06B6D4",
    opacity: 0.5,
  },
];

function driftKeyframes(amp: number) {
  // Pseudo-random but deterministic small wander — different for each axis
  return {
    x: [0, amp * 0.6, -amp * 0.4, amp * 0.3, 0],
    y: [0, -amp * 0.5, amp * 0.7, -amp * 0.2, 0],
    rotate: [0, 4, -3, 2, 0],
  };
}

export default function AnimatedHeroBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  // Mouse-parallax (decoupled from Framer transforms via three outer <g> wrappers)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function onMove(e: MouseEvent) {
      const rect = layerRef.current?.getBoundingClientRect();
      if (!rect) return;
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function tick() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const layer = layerRef.current;
      if (layer) {
        const p1 = layer.querySelector<SVGElement>("[data-parallax='1']");
        const p2 = layer.querySelector<SVGElement>("[data-parallax='2']");
        const p3 = layer.querySelector<SVGElement>("[data-parallax='3']");
        if (p1) p1.style.transform = `translate(${currentX * 24}px, ${currentY * 24}px)`;
        if (p2) p2.style.transform = `translate(${currentX * -16}px, ${currentY * -16}px)`;
        if (p3) p3.style.transform = `translate(${currentX * 10}px, ${currentY * 18}px)`;
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

  /** Which parallax layer a triangle belongs to (large = front, small = back). */
  function parallaxLayer(id: string): "1" | "2" | "3" {
    if (id.startsWith("L")) return "1";
    if (id.startsWith("M")) return "2";
    return "3";
  }

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

      {/* Layer 4: Exploding triangle cluster */}
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

        {/* Three mouse-parallax wrappers (outer, non-Framer) */}
        {(["1", "2", "3"] as const).map((layer) => (
          <g key={layer} data-parallax={layer}>
            {TRIANGLES.filter((t) => parallaxLayer(t.id) === layer).map((tri) => {
              const [cx, cy] = tri.centroid;
              // Delta needed to move this triangle back to the cluster origin
              const dx = CLUSTER.x - cx;
              const dy = CLUSTER.y - cy;

              const drift = driftKeyframes(tri.driftAmp);

              return (
                // Outer motion group: handles the one-shot "explode" entrance.
                <motion.g
                  key={tri.id}
                  initial={{
                    x: dx,
                    y: dy,
                    scale: 0.05,
                    rotate: tri.rotateFrom ?? 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    opacity: 1,
                  }}
                  transition={{
                    x: { type: "spring", stiffness: 60, damping: 14, delay: tri.delay },
                    y: { type: "spring", stiffness: 60, damping: 14, delay: tri.delay },
                    scale: { type: "spring", stiffness: 80, damping: 12, delay: tri.delay },
                    rotate: { type: "spring", stiffness: 50, damping: 15, delay: tri.delay },
                    opacity: { duration: 0.4, delay: tri.delay },
                  }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {/* Inner motion group: ambient drift, starts after the explode settles */}
                  <motion.g
                    animate={drift}
                    transition={{
                      duration: tri.driftMs / 1000,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: tri.delay + 1.2, // wait for explode to finish
                    }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <polygon
                      points={tri.points}
                      fill={tri.fill}
                      opacity={tri.opacity ?? 1}
                    />
                  </motion.g>
                </motion.g>
              );
            })}
          </g>
        ))}

        {/* Subtle glow at the cluster origin during the initial explode */}
        <motion.circle
          cx={CLUSTER.x}
          cy={CLUSTER.y}
          r="80"
          fill="url(#triGrad1)"
          initial={{ opacity: 0.7, scale: 0.2 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.05 }}
          style={{ filter: "blur(20px)", transformBox: "fill-box", transformOrigin: "center" }}
        />
      </svg>

      {/* Layer 5: Pulsing network nodes (left/center) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="#60A5FA" strokeWidth="0.5" opacity="0.25">
          <line x1="120" y1="180" x2="280" y2="320" />
          <line x1="280" y1="320" x2="180" y2="520" />
          <line x1="180" y1="520" x2="360" y2="620" />
          <line x1="360" y1="620" x2="480" y2="440" />
          <line x1="480" y1="440" x2="280" y2="320" />
        </g>
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
