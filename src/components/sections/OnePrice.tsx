"use client";

import { motion } from "framer-motion";

/**
 * "One Price. Complete Coverage. Zero Surprises."
 *
 * Pricing-transparency value prop. No tiers, no line items — just the
 * commitment that everything is bundled into a single predictable fee.
 * Designed to address the #1 objection SMBs have about MSPs: opaque pricing.
 */

const assurances = [
  "No surprise invoices when a threat is detected",
  "No à la carte charges when you need a restore",
  "No separate contracts to juggle",
  "No scope creep or “change order” games",
];

export default function OnePrice() {
  return (
    <section className="relative overflow-hidden bg-surface-white py-28">
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-grid-ink mask-radial-fade opacity-40" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Left: Headline + copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="eyebrow mb-4 flex items-center gap-3 text-accent">
              <span className="inline-block h-[1px] w-8 bg-accent/60" />
              Pricing
            </div>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
              One price. <br />
              <span className="text-ink-soft/60">Complete coverage.</span>{" "}
              <br />
              Zero surprises.
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-ink-soft">
              Every tool in the stack — monitoring, threat detection, identity
              protection, email security, DNS filtering, backup, training, and
              network management — is bundled into a single predictable monthly
              fee per user.
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
              You know exactly what security costs. Every month, without
              exception. Budget with confidence. Sleep with confidence.
            </p>
          </motion.div>

          {/* Right: Commitment card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Decorative gradient corner */}
            <div
              aria-hidden="true"
              className="absolute -inset-[1px] rounded-2xl opacity-70"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.2), transparent 60%)",
              }}
            />

            <div className="relative rounded-2xl border border-navy-900/10 bg-surface-white p-8 shadow-[0_24px_48px_-16px_rgba(11,10,59,0.1)] sm:p-10">
              {/* Headline price marker */}
              <div className="mb-6 flex items-baseline justify-between border-b border-navy-900/10 pb-6">
                <div>
                  <div className="eyebrow text-navy-900/50">What&apos;s included</div>
                  <div className="mt-2 font-display text-3xl font-semibold text-navy-900">
                    Everything.
                  </div>
                </div>
                <div className="text-right">
                  <div className="eyebrow text-navy-900/50">Per user</div>
                  <div className="mt-2 font-display text-3xl font-semibold text-navy-900">
                    One fee.
                  </div>
                </div>
              </div>

              {/* Assurance checklist */}
              <ul className="space-y-3">
                {assurances.map((line, i) => (
                  <motion.li
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <svg
                      className="mt-[3px] h-4 w-4 shrink-0 text-cyan"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M3 8l3.5 3.5L13 5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-navy-900/80">{line}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Closing line */}
              <p className="mt-8 border-t border-navy-900/10 pt-6 font-mono-ui text-xs tracking-[0.15em] text-navy-900/50">
                THAT&apos;S THE POINT.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
