"use client";

import { motion } from "framer-motion";
import { PortableText } from "next-sanity";
import type { Service } from "@/types";
import TiltCard from "@/components/ui/TiltCard";
import ServiceIcon from "@/components/ui/ServiceIcon";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="h-full rounded-2xl" intensity={5}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy-900/10 bg-white p-8 shadow-[0_1px_0_rgba(11,10,59,0.04),0_8px_24px_-12px_rgba(11,10,59,0.12)] transition-shadow duration-300 group-hover:shadow-[0_1px_0_rgba(11,10,59,0.04),0_24px_48px_-16px_rgba(6,182,212,0.25)]">
          {/* Number badge — mono accent */}
          <div className="mb-6 flex items-center justify-between">
            <div className="font-mono-ui text-xs tracking-[0.2em] text-ink-soft/60">
              {String(service.order).padStart(2, "0")} / 05
            </div>
            <div className="h-px flex-1 translate-x-4 bg-gradient-to-r from-ink-soft/15 to-transparent" />
          </div>

          {/* Icon */}
          <div className="mb-6 text-accent transition-colors duration-300 group-hover:text-cyan">
            <ServiceIcon kind={service.title} />
          </div>

          {/* Title */}
          <h3 className="font-display text-2xl font-semibold leading-tight text-navy-900">
            {service.title}
          </h3>

          {/* Description */}
          <div className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
            <PortableText value={service.description} />
          </div>

          {/* Tagline — accent with bullet */}
          {service.tagline && (
            <div className="mt-6 flex items-center gap-2 border-t border-navy-900/10 pt-5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              <p className="text-sm font-medium text-navy-900">
                {service.tagline}
              </p>
            </div>
          )}

          {/* Corner accent — appears on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-32 w-32 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 100% 0%, rgba(34, 211, 238, 0.15), transparent 70%)",
            }}
          />
        </div>
      </TiltCard>
    </motion.div>
  );
}
