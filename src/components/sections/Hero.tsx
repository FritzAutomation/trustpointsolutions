"use client";

import { motion } from "framer-motion";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import Button from "@/components/ui/Button";
import GeometricPattern from "@/components/ui/GeometricPattern";

interface HeroProps {
  heading: string;
  subheading: PortableTextBlock[];
  ctaText: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Hero({ heading, subheading, ctaText }: HeroProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy">
      <GeometricPattern />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.h1
            className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            {heading}
          </motion.h1>
          <motion.div
            className="mt-6 space-y-4 text-lg text-white/80"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <PortableText value={subheading} />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <Button href="#contact" variant="primary" className="mt-8">
              {ctaText}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
