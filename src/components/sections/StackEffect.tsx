"use client";

import { motion } from "framer-motion";

/**
 * "The Stack Effect: Better Together"
 *
 * A narrative section explaining how layered security reinforces itself.
 * Uses a sequenced example — an employee clicks a bad link — and shows
 * how each layer catches the threat at a different stage. Builds trust
 * through specificity rather than generic marketing claims.
 */

interface Layer {
  stage: string;
  label: string;
  defense: string;
  description: string;
}

const layers: Layer[] = [
  {
    stage: "01",
    label: "The trigger",
    defense: "DNS filtering",
    description:
      "An employee clicks a suspicious link. Before the page can even load, DNS filtering blocks the domain at the network level — whether they're at the office, at home, or on a coffee-shop Wi-Fi.",
  },
  {
    stage: "02",
    label: "The backup",
    defense: "Email security",
    description:
      "If the link arrived by email, advanced threat analysis already quarantined the message before delivery — inspecting behavior, not just signatures.",
  },
  {
    stage: "03",
    label: "The catch",
    defense: "Endpoint detection",
    description:
      "If malware still reaches a device, behavioral detection identifies and contains it within minutes — and a human threat-hunting team investigates in real time.",
  },
  {
    stage: "04",
    label: "The trap",
    defense: "Identity protection",
    description:
      "And when an attacker skips all of that by simply logging in with stolen credentials? Identity threat detection spots the behavior that looks legitimate until it very much isn't.",
  },
];

export default function StackEffect() {
  return (
    <section className="cursor-glow-target noise relative overflow-hidden bg-navy-950 py-28">
      {/* Ambient depth */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[400px] w-[1000px] -translate-x-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse, rgba(6, 182, 212, 0.3) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
      <div className="absolute inset-0 bg-grid mask-radial-fade opacity-40" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <div className="eyebrow mb-4 flex items-center gap-3 text-cyan-light">
            <span className="inline-block h-[1px] w-8 bg-cyan-light/60" />
            The Stack Effect
          </div>
          <h2 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
            Every layer is powerful.{" "}
            <span className="text-white/50">Together, they&apos;re formidable.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/60">
            Antivirus alone is yesterday&apos;s solution. Real protection comes
            from tools that communicate, complement, and reinforce each other —
            so a threat that slips past one layer gets caught by the next.
          </p>
        </div>

        {/* Narrative layers */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.stage}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Connecting arrow (desktop only, between cards) */}
              {i < layers.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute -right-3 top-8 hidden text-cyan/40 lg:block"
                >
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                    <path
                      d="M2 8h18m0 0l-6-5m6 5l-6 5"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <div className="relative h-full rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.05]">
                {/* Stage number + label */}
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="font-mono-ui text-xs tracking-[0.2em] text-cyan-light">
                    {layer.stage}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    {layer.label}
                  </span>
                </div>

                {/* Defense name */}
                <h3 className="font-display text-xl font-semibold text-white">
                  {layer.defense}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {layer.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 text-center font-display text-lg font-medium text-white/70"
        >
          Think of it as a security team that never sleeps, never calls in sick,{" "}
          <span className="text-white">and never misses a patch.</span>
        </motion.p>
      </div>
    </section>
  );
}
