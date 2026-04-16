"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A soft cyan/accent glow that follows the cursor.
 * Fades in when hovering a `.cursor-glow-target` ancestor (dark sections).
 * Purely decorative — disabled for reduced-motion users and touch devices.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Respect reduced-motion + disable on touch-only devices
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (reduced || isTouch) {
      setEnabled(false);
      return;
    }

    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    function onMove(e: MouseEvent) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (glowRef.current) {
            glowRef.current.style.transform = `translate3d(${lastX - 300}px, ${lastY - 300}px, 0)`;
          }
          rafId = 0;
        });
      }

      // Show only when hovering a dark-section target
      const target = e.target as HTMLElement | null;
      const inTarget = !!target?.closest?.(".cursor-glow-target");
      setVisible(inTarget);
    }

    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[60] h-[600px] w-[600px] rounded-full transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background:
          "radial-gradient(circle at center, rgba(34, 211, 238, 0.18) 0%, rgba(59, 130, 246, 0.10) 25%, transparent 60%)",
        filter: "blur(40px)",
        willChange: "transform",
      }}
    />
  );
}
