"use client";

import Link from "next/link";
import { useRef } from "react";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export default function Button({
  href,
  onClick,
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const ref = useRef<HTMLElement & HTMLAnchorElement & HTMLButtonElement>(null);

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  const base =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-white text-navy-950 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_10px_30px_-10px_rgba(34,211,238,0.5)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_20px_50px_-10px_rgba(34,211,238,0.8)]",
    outline:
      "border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/10",
    ghost:
      "text-white/80 hover:text-white before:absolute before:inset-0 before:-z-10 before:rounded-full before:border before:border-white/10 hover:before:border-white/30 before:transition-colors",
  };

  const styles = `${base} ${variants[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`;

  const shimmer =
    variant === "primary" ? (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ animation: "shimmer 1.2s ease-in-out infinite" }}
      />
    ) : null;

  const inner = (
    <>
      {shimmer}
      <span className="relative z-10 flex items-center">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={styles}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      disabled={disabled}
      className={styles}
    >
      {inner}
    </button>
  );
}
