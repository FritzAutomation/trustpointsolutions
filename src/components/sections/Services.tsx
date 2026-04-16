import SectionWrapper from "@/components/ui/SectionWrapper";
import ServiceCard from "./ServiceCard";
import type { Service } from "@/types";

interface ServicesProps {
  heading: string;
  services: Service[];
}

export default function Services({ heading, services }: ServicesProps) {
  return (
    <SectionWrapper className="bg-surface" id="services">
      <h2 className="mb-12 text-3xl font-bold text-navy">{heading}</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={service._id} service={service} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
