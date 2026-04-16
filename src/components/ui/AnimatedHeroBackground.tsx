"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

/**
 * Layered animated background for the hero:
 *   1. Deep navy gradient base
 *   2. Ambient gradient mesh (breathing blobs)
 *   3. Blueprint grid with radial fade
 *   4. Tessellated triangle pattern (echoing original Wix layout) that
 *      enters from a clustered origin, then continuously "breathes" —
 *      triangles blow outward radially and return to their pattern.
 *   5. Pulsing network nodes
 *   6. Noise overlay
 */

interface Tri {
  key: string;
  points: string;
  centroid: [number, number];
  fill: string;
  opacity: number;
  enterDelay: number;
  breatheDelay: number;
}

const PALETTE = [
  { fill: "#1E40AF", opacity: 0.9 },
  { fill: "#2563EB", opacity: 0.85 },
  { fill: "#3B82F6", opacity: 0.85 },
  { fill: "#60A5FA", opacity: 0.75 },
  { fill: "#93C5FD", opacity: 0.6 },
  { fill: "#BFDBFE", opacity: 0.45 },
  { fill: "#FFFFFF", opacity: 0.35 },
  { fill: "transparent", opacity: 0 },
];

// SVG viewBox is 0 0 600 600.
const GRID_COLS = 12;
const GRID_ROWS = 10;
const CELL = 50;

// Deterministic pseudo-random in [0,1) — avoids hydration drift.
function hash(c: number, r: number, salt = 0): number {
  const n = Math.sin(c * 12.9898 + r * 78.233 + salt * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

function pickColor(c: number, r: number, salt: number) {
  const score = (c + (GRID_ROWS - r)) / (GRID_COLS + GRID_ROWS);
  const rand = hash(c, r, salt + 7);
  const weights = [
    score * 1.2,
    score * 1.1,
    0.9,
    1.0,
    1.1 - score,
    0.7 - score * 0.4,
    0.5 - score * 0.3,
    Math.max(0.3 - score * 0.4, 0.05),
  ];
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const target = rand * total;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (target <= acc) return PALETTE[i];
  }
  return PALETTE[0];
}

/** Generate the tessellated triangle pattern along a diagonal band. */
function generatePattern(): Tri[] {
  const tris: Tri[] = [];

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const band = c - r * 0.9 + 1.5;
      if (band < -0.5 || band > 8) continue;

      const cellNoise = hash(c, r, 1);
      const onBand = band >= 1 && band <= 6.5;
      if (!onBand && cellNoise > 0.55) continue;

      const x0 = c * CELL;
      const y0 = r * CELL;
      const x1 = x0 + CELL;
      const y1 = y0 + CELL;

      const upperColor = pickColor(c, r, 0);
      if (upperColor.fill !== "transparent") {
        tris.push({
          key: `u-${c}-${r}`,
          points: `${x0},${y0} ${x1},${y0} ${x0},${y1}`,
          centroid: [(x0 + x1 + x0) / 3, (y0 + y0 + y1) / 3],
          fill: upperColor.fill,
          opacity: upperColor.opacity,
          enterDelay: 0.05 + hash(c, r, 2) * 0.7,
          breatheDelay: hash(c, r, 3) * 5,
        });
      }

      const lowerColor = pickColor(c, r, 1);
      if (lowerColor.fill !== "transparent") {
        tris.push({
          key: `l-${c}-${r}`,
          points: `${x1},${y0} ${x1},${y1} ${x0},${y1}`,
          centroid: [(x1 + x1 + x0) / 3, (y0 + y1 + y1) / 3],
          fill: lowerColor.fill,
          opacity: lowerColor.opacity,
          enterDelay: 0.1 + hash(c, r, 4) * 0.7,
          breatheDelay: 0.3 + hash(c, r, 5) * 5,
        });
      }
    }
  }

  return tris;
}

/** Visual center of the tessellated pattern — triangles blow outward from here. */
const PATTERN_CENTER = { x: 420, y: 200 };

export default function AnimatedHeroBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const triangles = useMemo(() => generatePattern(), []);

  // Mouse parallax on the pattern as a whole
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

      const parallax = layerRef.current?.querySelector<SVGElement>("[data-parallax]");
      if (parallax) {
        parallax.style.transform = `translate(${currentX * 18}px, ${currentY * 14}px)`;
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
      {/* Deep base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, var(--color-navy-light) 0%, var(--color-navy-900) 50%, var(--color-navy-950) 100%)",
        }}
      />

      {/* Ambient gradient mesh */}
      <div
        className="absolute -right-[10%] top-[-10%] h-[60vh] w-[60vh] rounded-full opacity-70"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)",
          filter: "blur(60px)",
          animation: "mesh-breathe 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[-15%] top-[30%] h-[50vh] w-[50vh] rounded-full opacity-60"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 60%)",
          filter: "blur(70px)",
          animation: "mesh-breathe 16s ease-in-out infinite 2s",
        }}
      />
      <div
        className="absolute right-[5%] bottom-[-10%] h-[40vh] w-[40vh] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 60%)",
          filter: "blur(80px)",
          animation: "mesh-breathe 14s ease-in-out infinite 4s",
        }}
      />

      {/* Blueprint grid */}
      <div className="absolute inset-0 bg-grid mask-radial-fade opacity-60" />

      {/* Tessellated triangle pattern with breathing animation.
          Left-edge mask fades the pattern into the background so it doesn't
          compete with the hero text. */}
      <svg
        className="absolute right-0 top-0 h-full w-[55%] opacity-90"
        viewBox="0 0 600 600"
        fill="none"
        preserveAspectRatio="xMaxYMid slice"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 18%, black 55%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 18%, black 55%)",
        }}
      >
        <g data-parallax>
          {triangles.map((tri) => {
            const [cx, cy] = tri.centroid;

            // Cluster origin delta — where the triangle starts during entrance
            const clusterDx = PATTERN_CENTER.x - cx;
            const clusterDy = PATTERN_CENTER.y - cy;

            // Radial blow-apart vector (away from pattern center)
            const vx = cx - PATTERN_CENTER.x;
            const vy = cy - PATTERN_CENTER.y;
            const dist = Math.max(10, Math.hypot(vx, vy));
            const blowMag = Math.min(70, dist * 0.45 + 20);
            const blowX = (vx / dist) * blowMag;
            const blowY = (vy / dist) * blowMag;

            const rotate = (hash(cx, cy, 11) - 0.5) * 14;

            // Round to 2 decimals so server and client produce identical
            // string values (avoids React hydration mismatches from FP drift).
            const r2 = (n: number) => Math.round(n * 100) / 100;

            // Inline CSS vars drive the shared @keyframes
            const vars: CSSProperties & Record<string, string | number> = {
              ["--cluster-dx"]: `${r2(clusterDx)}px`,
              ["--cluster-dy"]: `${r2(clusterDy)}px`,
              ["--blow-x"]: `${r2(blowX)}px`,
              ["--blow-y"]: `${r2(blowY)}px`,
              ["--blow-rotate"]: `${r2(rotate)}deg`,
              ["--tri-opacity"]: String(tri.opacity),
              ["--enter-delay"]: `${r2(tri.enterDelay)}s`,
              ["--breathe-delay"]: `${r2(1.5 + tri.breatheDelay)}s`,
              transformBox: "fill-box",
              transformOrigin: "center",
              opacity: 0,
              animation:
                "tri-enter 1.2s ease-out var(--enter-delay) forwards, " +
                "tri-breathe 10s ease-in-out var(--breathe-delay) infinite",
            };

            return (
              <polygon
                key={tri.key}
                points={tri.points}
                fill={tri.fill}
                style={vars}
              />
            );
          })}
        </g>
      </svg>

      {/* Pulsing network nodes (left/center, subtle) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="#60A5FA" strokeWidth="0.5" opacity="0.2">
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
