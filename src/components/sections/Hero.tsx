"use client";

import { motion } from "framer-motion";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import Button from "@/components/ui/Button";
import AnimatedHeroBackground from "@/components/ui/AnimatedHeroBackground";

interface HeroProps {
  heading: string;
  subheading: PortableTextBlock[];
  ctaText: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.3 + i * 0.12,
      duration: 0.8,
      ease: "easeOut" as const,
    },
  }),
};

export default function Hero({ heading, subheading, ctaText }: HeroProps) {
  return (
    <section
      id="top"
      className="cursor-glow-target relative flex min-h-screen items-center overflow-hidden"
    >
      <AnimatedHeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
        {/* Eyebrow label — monospace technical accent */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="eyebrow mb-8 flex items-center gap-3 text-cyan-light"
        >
          <span className="inline-block h-[1px] w-8 bg-cyan-light/60" />
          Managed IT Services
        </motion.div>

        <div className="max-w-3xl">
          <motion.h1
            className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            {heading}
          </motion.h1>

          <motion.div
            className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-white/70"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <PortableText value={subheading} />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button href="#contact" variant="primary">
              {ctaText}
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Button>
            <Button href="#services" variant="ghost">
              See our services
            </Button>
          </motion.div>

          {/* Status indicator — subtle credibility signal */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-16 flex items-center gap-3 font-mono-ui text-xs text-white/50"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            SYSTEMS MONITORING ACTIVE
          </motion.div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-surface" />
    </section>
  );
}
