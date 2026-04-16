"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We audit your current infrastructure, identify risks, and map out what success looks like for your business.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "A tailored plan — security layers, backup strategy, cloud setup — built around your team and budget.",
  },
  {
    number: "03",
    title: "Deploy",
    description:
      "We implement monitoring, security, and tooling without disrupting your day-to-day operations.",
  },
  {
    number: "04",
    title: "Support",
    description:
      "24/7 proactive monitoring and a helpdesk that knows your environment. No tier-one runaround.",
  },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 40%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      id="process"
      className="relative overflow-hidden bg-surface-white py-28"
    >
      <div className="absolute inset-0 bg-grid-ink mask-radial-fade opacity-40" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div className="eyebrow mb-4 flex items-center gap-3 text-accent">
            <span className="inline-block h-[1px] w-8 bg-accent/60" />
            How we work
          </div>
          <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-navy-900 sm:text-5xl">
            A process that feels{" "}
            <span className="text-ink-soft/60">invisible.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-soft">
            Four phases, zero surprises. You&apos;ll always know what&apos;s
            happening and why — from the first conversation onward.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Track: background line */}
          <div
            aria-hidden="true"
            className="absolute left-[18px] top-0 h-full w-px bg-navy-900/10 md:left-[24px]"
          />
          {/* Track: progress line */}
          <motion.div
            aria-hidden="true"
            className="absolute left-[18px] top-0 w-px origin-top bg-gradient-to-b from-accent to-cyan md:left-[24px]"
            style={{ height: lineHeight }}
          />

          <ul className="space-y-12">
            {steps.map((step, i) => (
              <motion.li
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative grid grid-cols-[48px_1fr] items-start gap-6 md:grid-cols-[72px_1fr] md:gap-10"
              >
                {/* Number marker */}
                <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-navy-900/10 bg-white shadow-sm md:h-12 md:w-12">
                  <span className="font-mono-ui text-[11px] font-medium tracking-[0.1em] text-navy-900 md:text-sm">
                    {step.number}
                  </span>
                </div>

                <div className="pt-1 md:pt-2">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-navy-900 md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
