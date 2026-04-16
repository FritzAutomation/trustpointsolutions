"use client";

import { motion } from "framer-motion";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";

interface TrustedPartnerProps {
  heading: string;
  body: PortableTextBlock[];
}

export default function TrustedPartner({ heading, body }: TrustedPartnerProps) {
  return (
    <section className="cursor-glow-target noise relative overflow-hidden bg-navy-950 py-28">
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid mask-radial-fade opacity-50" />

      <motion.div
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="eyebrow mb-6 flex items-center justify-center gap-3 text-cyan-light">
          <span className="inline-block h-[1px] w-8 bg-cyan-light/60" />
          Our promise
          <span className="inline-block h-[1px] w-8 bg-cyan-light/60" />
        </div>
        <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {heading}
        </h2>
        <div className="mt-8 text-lg leading-relaxed text-white/70">
          <PortableText value={body} />
        </div>
      </motion.div>
    </section>
  );
}
