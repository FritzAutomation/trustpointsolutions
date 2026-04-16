"use client";

import { motion } from "framer-motion";
import type { PullQuote as PullQuoteData } from "@/types";

/**
 * Large feature pull quote placed between sections. Alternates between
 * light and dark visual treatments so quotes inherit the right palette
 * wherever they're placed in the flow.
 */

interface Props {
  quote: PullQuoteData;
  /** When true, renders against a dark background (use after dark sections). */
  dark?: boolean;
}

export default function PullQuote({ quote, dark = false }: Props) {
  const bg = dark ? "bg-navy-950" : "bg-surface-white";
  const mainText = dark ? "text-white" : "text-navy-900";
  const softText = dark ? "text-white/50" : "text-ink-soft/60";
  const attribColor = dark ? "text-cyan-light" : "text-accent";
  const rule = dark ? "bg-cyan-light/60" : "bg-accent/60";
  const grid = dark ? "bg-grid" : "bg-grid-ink";

  return (
    <section className={`relative overflow-hidden ${bg} py-24`}>
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${grid} mask-radial-fade opacity-40`}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Decorative opening quote */}
          <span
            aria-hidden="true"
            className={`absolute -left-2 -top-8 select-none font-display text-8xl leading-none ${softText} sm:text-9xl`}
          >
            &ldquo;
          </span>

          <p
            className={`relative font-display text-3xl font-semibold leading-[1.2] tracking-tight ${mainText} sm:text-4xl md:text-5xl`}
          >
            {quote.text}
          </p>

          {quote.attribution && (
            <footer className="mt-8 flex items-center gap-3">
              <span className={`inline-block h-[1px] w-10 ${rule}`} />
              <span
                className={`font-mono-ui text-xs tracking-[0.15em] ${attribColor}`}
              >
                — {quote.attribution}
              </span>
            </footer>
          )}
        </motion.blockquote>
      </div>
    </section>
  );
}
