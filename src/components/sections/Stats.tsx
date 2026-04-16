"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Stat {
  label: string;
  value: string;
  suffix?: string;
  /** If provided, the number part is animated. Otherwise the raw string is shown. */
  numeric?: number;
  prefix?: string;
}

const stats: Stat[] = [
  { label: "Monitoring", value: "24/7", prefix: "", suffix: "" },
  { label: "Response Target", numeric: 1, prefix: "<", suffix: "hr", value: "<1hr" },
  { label: "Uptime Target", numeric: 99.9, suffix: "%", value: "99.9%" },
  { label: "Support Channels", numeric: 4, suffix: "", value: "4" },
];

function useAnimatedNumber(target: number, active: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

function StatItem({ stat, index, active }: { stat: Stat; index: number; active: boolean }) {
  const animated = useAnimatedNumber(stat.numeric ?? 0, active);
  const hasNumeric = stat.numeric !== undefined;
  const formatted = hasNumeric
    ? Number.isInteger(stat.numeric!)
      ? Math.round(animated).toString()
      : animated.toFixed(1)
    : stat.value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col gap-2 border-l border-white/10 pl-6 first:border-l-0 md:border-l md:first:border-l"
    >
      <div className="eyebrow text-white/40">{stat.label}</div>
      <div className="font-display text-4xl font-semibold leading-none tracking-tight text-white sm:text-5xl">
        {stat.prefix && <span className="text-cyan">{stat.prefix}</span>}
        {hasNumeric ? formatted : stat.value}
        {stat.suffix && <span className="text-cyan">{stat.suffix}</span>}
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="cursor-glow-target noise relative overflow-hidden bg-navy-950 py-20"
    >
      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid mask-radial-fade opacity-60"
      />

      {/* Accent gradient */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[1px] w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan to-transparent opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
