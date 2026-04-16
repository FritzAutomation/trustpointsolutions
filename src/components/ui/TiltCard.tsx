"use client";

import { useRef, useState, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** How strong the tilt effect is (degrees). Default 6. */
  intensity?: number;
}

/**
 * 3D tilt card wrapper. Subtle perspective tilt toward cursor + a
 * gradient spotlight that tracks the mouse for an extra depth cue.
 * Disabled for reduced-motion and touch devices.
 */
export default function TiltCard({
  children,
  className = "",
  intensity = 6,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(hover: none)").matches) return;
    }

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 2 * intensity;
    const rotateX = (0.5 - y) * 2 * intensity;

    el.style.setProperty("--rx", `${rotateX}deg`);
    el.style.setProperty("--ry", `${rotateY}deg`);
    setSpot({ x: x * 100, y: y * 100 });
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    setHover(false);
  }

  function handleEnter() {
    setHover(true);
    const el = ref.current;
    el?.setAttribute("data-hover", "true");
  }

  function handleLeaveFull() {
    handleLeave();
    const el = ref.current;
    el?.setAttribute("data-hover", "false");
  }

  return (
    <div
      ref={ref}
      data-hover="false"
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeaveFull}
      className={`group relative transition-transform duration-300 ease-out ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
      }}
    >
      {children}

      {/* Cursor spotlight overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${spot.x}% ${spot.y}%, rgba(34, 211, 238, 0.12), transparent 40%)`,
        }}
      />

      {/* Animated gradient border — visible on hover */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 ${
          hover ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "conic-gradient(from var(--angle), transparent 0%, rgba(34, 211, 238, 0.6) 25%, rgba(59, 130, 246, 0.6) 50%, transparent 75%)",
          animation: hover ? "border-spin 4s linear infinite" : "none",
          maskImage:
            "linear-gradient(black, black), linear-gradient(black, black)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
    </div>
  );
}
