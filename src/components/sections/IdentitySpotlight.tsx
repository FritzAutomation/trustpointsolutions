"use client";

import { motion } from "framer-motion";
import type { IdentitySpotlightContent } from "@/types";

/**
 * "Attackers don't break in — they log in." ITDR feature section.
 *
 * All content is CMS-driven (via the `identitySpotlight` object on the
 * `homePage` singleton). The component accepts a partial content object
 * and falls back to client-copy defaults for any unset field.
 */

interface Props {
  content?: IdentitySpotlightContent;
}

const DEFAULTS: Required<Omit<IdentitySpotlightContent, "callouts">> & {
  callouts: NonNullable<IdentitySpotlightContent["callouts"]>;
} = {
  eyebrow: "Identity Protection",
  heading: "Attackers don't break in.",
  headingEmphasis: "They log in.",
  intro:
    "Stolen credentials are the #1 entry point for breaches today. Most security tools are built to watch devices and messages — not people. Our identity-layer protection closes the gap.",
  callouts: [
    {
      title: "Endpoint protection watches devices.",
      description:
        "Behavioral detection contains malware once it reaches a machine — necessary, but reactive.",
    },
    {
      title: "Email security watches messages.",
      description:
        "AI-driven analysis catches phishing and business email compromise before it lands in the inbox.",
    },
    {
      title: "ITDR watches people.",
      description:
        "Or rather — anyone pretending to be them. Unusual logins, impossible travel, credential stuffing — flagged and contained in real time.",
    },
  ],
  closing:
    "It closes the identity-shaped hole in every other security layer.",
};

export default function IdentitySpotlight({ content }: Props) {
  const c = {
    eyebrow: content?.eyebrow ?? DEFAULTS.eyebrow,
    heading: content?.heading ?? DEFAULTS.heading,
    headingEmphasis: content?.headingEmphasis ?? DEFAULTS.headingEmphasis,
    intro: content?.intro ?? DEFAULTS.intro,
    callouts:
      content?.callouts && content.callouts.length > 0
        ? content.callouts
        : DEFAULTS.callouts,
    closing: content?.closing ?? DEFAULTS.closing,
  };

  return (
    <section className="cursor-glow-target noise relative overflow-hidden bg-navy-950 py-28">
      {/* Ambient depth */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[1px] w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 60%)",
          filter: "blur(70px)",
        }}
      />
      <div className="absolute inset-0 bg-grid mask-radial-fade opacity-40" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="eyebrow mb-6 flex items-center gap-3 text-cyan-light"
        >
          <span className="inline-block h-[1px] w-8 bg-cyan-light/60" />
          {c.eyebrow}
        </motion.div>

        {/* Headline — two-line with cyan accent on second */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          {c.heading}
          <br />
          <span
            className="bg-gradient-to-r from-cyan to-accent-light bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: "text" }}
          >
            {c.headingEmphasis}
          </span>
        </motion.h2>

        {/* Intro paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70"
        >
          {c.intro}
        </motion.p>

        {/* Callouts — visual staircase showing the gap ITDR closes */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {c.callouts.map((callout, i) => {
            const isSpotlight = i === c.callouts.length - 1;
            return (
              <motion.div
                key={callout.title + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative rounded-2xl border p-6 backdrop-blur-sm transition-colors ${
                  isSpotlight
                    ? "border-cyan/40 bg-gradient-to-br from-cyan/10 to-accent/5"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {isSpotlight && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-navy-950 px-3 py-1 font-mono-ui text-[10px] tracking-[0.15em] text-cyan">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
                    </span>
                    CRITICAL LAYER
                  </span>
                )}

                <h3
                  className={`font-display text-lg font-semibold ${
                    isSpotlight ? "text-white" : "text-white/90"
                  }`}
                >
                  {callout.title}
                </h3>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    isSpotlight ? "text-white/80" : "text-white/55"
                  }`}
                >
                  {callout.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 max-w-2xl font-display text-xl font-medium leading-snug text-white/80 sm:text-2xl"
        >
          {c.closing}
        </motion.p>
      </div>
    </section>
  );
}
