"use client";

import { motion } from "framer-motion";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import SectionWrapper from "@/components/ui/SectionWrapper";

interface TrustedPartnerProps {
  heading: string;
  body: PortableTextBlock[];
}

export default function TrustedPartner({ heading, body }: TrustedPartnerProps) {
  return (
    <SectionWrapper className="bg-navy text-white">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
        <div className="mt-6 text-lg text-white/80">
          <PortableText value={body} />
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
