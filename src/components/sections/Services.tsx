import ServiceCard from "./ServiceCard";
import type { Service } from "@/types";

interface ServicesProps {
  heading: string;
  services: Service[];
}

export default function Services({ heading, services }: ServicesProps) {
  return (
    <section id="services" className="relative overflow-hidden bg-surface py-28">
      {/* Faint grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-ink mask-radial-fade opacity-80"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="eyebrow mb-4 flex items-center gap-3 text-accent">
              <span className="inline-block h-[1px] w-8 bg-accent/60" />
              What we do
            </div>
            <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-navy-900 sm:text-5xl">
              {heading.toLowerCase() === "services" ? (
                <>
                  A full-stack partner{" "}
                  <span className="text-ink-soft/60">for your IT.</span>
                </>
              ) : (
                heading
              )}
            </h2>
          </div>

          <div className="max-w-sm text-sm leading-relaxed text-ink-soft">
            Everything a modern business needs to keep technology running
            quietly in the background — backed by humans who know your network.
          </div>
        </div>

        {/* Services grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
