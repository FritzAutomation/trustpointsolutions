"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PortableText } from "next-sanity";
import type { Service } from "@/types";
import { urlFor } from "@/lib/sanity/image";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      className="flex flex-col rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      {service.image && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <Image
            src={urlFor(service.image).width(400).height(250).url()}
            alt={service.title}
            width={400}
            height={250}
            className="h-48 w-full object-cover"
          />
        </div>
      )}
      <h3 className="text-xl font-bold text-navy">{service.title}</h3>
      <div className="mt-2 flex-1 text-navy/70">
        <PortableText value={service.description} />
      </div>
      {service.tagline && (
        <p className="mt-4 font-semibold text-accent">{service.tagline}</p>
      )}
    </motion.div>
  );
}
