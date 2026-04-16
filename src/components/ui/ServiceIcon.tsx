/**
 * Hand-drawn SVG icons for each service.
 * Line style with a mono aesthetic — CSS animates them on card hover via [data-hover].
 */

interface ServiceIconProps {
  kind: string;
  className?: string;
}

export default function ServiceIcon({ kind, className = "" }: ServiceIconProps) {
  const props = {
    className: `h-12 w-12 ${className}`,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const match = matchIcon(kind);

  switch (match) {
    case "management":
      // Monitor with pulse
      return (
        <svg {...props}>
          <rect x="6" y="10" width="36" height="24" rx="2" stroke="currentColor" />
          <path d="M16 40h16M24 34v6" stroke="currentColor" />
          <path
            d="M12 22l5-5 4 6 5-8 6 10 4-4"
            stroke="currentColor"
            className="[stroke-dasharray:60] [stroke-dashoffset:60] group-data-[hover=true]:animate-[draw_1.2s_ease-out_forwards]"
          />
          <circle cx="36" cy="15" r="1.5" fill="currentColor" className="group-data-[hover=true]:animate-[pulse-node_1.5s_ease-in-out_infinite]" />
        </svg>
      );

    case "support":
      // Headset with concentric rings
      return (
        <svg {...props}>
          <path
            d="M10 26v-4a14 14 0 0128 0v4"
            stroke="currentColor"
          />
          <rect x="6" y="24" width="8" height="12" rx="2" stroke="currentColor" />
          <rect x="34" y="24" width="8" height="12" rx="2" stroke="currentColor" />
          <path
            d="M38 36v2a4 4 0 01-4 4h-4"
            stroke="currentColor"
          />
          <circle cx="28" cy="42" r="1.5" stroke="currentColor" />
          <circle cx="42" cy="30" r="3" stroke="currentColor" opacity="0.4" className="group-data-[hover=true]:animate-[pulse-node_2s_ease-in-out_infinite]" />
          <circle cx="42" cy="30" r="6" stroke="currentColor" opacity="0.2" className="group-data-[hover=true]:animate-[pulse-node_2s_ease-in-out_infinite_0.5s]" />
        </svg>
      );

    case "security":
      // Shield with checkmark that draws in
      return (
        <svg {...props}>
          <path
            d="M24 6l14 5v11c0 8-6 14-14 18-8-4-14-10-14-18V11l14-5z"
            stroke="currentColor"
          />
          <path
            d="M17 24l5 5 10-10"
            stroke="currentColor"
            className="[stroke-dasharray:24] [stroke-dashoffset:24] group-data-[hover=true]:animate-[draw_0.9s_ease-out_forwards]"
          />
        </svg>
      );

    case "cloud":
      // Cloud with flowing data particles
      return (
        <svg {...props}>
          <path
            d="M14 32a7 7 0 01-2-13.5A10 10 0 0132 17a7 7 0 01-2 15H14z"
            stroke="currentColor"
          />
          <g className="group-data-[hover=true]:animate-[pulse-node_2s_ease-in-out_infinite]">
            <circle cx="16" cy="40" r="1" fill="currentColor" />
            <circle cx="24" cy="42" r="1" fill="currentColor" />
            <circle cx="32" cy="40" r="1" fill="currentColor" />
          </g>
          <path d="M20 32v6M28 32v8M36 32v5" stroke="currentColor" strokeDasharray="2 3" opacity="0.5" />
        </svg>
      );

    case "backup":
      // Circular arrow + disk
      return (
        <svg {...props}>
          <circle cx="24" cy="24" r="16" stroke="currentColor" />
          <circle cx="24" cy="24" r="10" stroke="currentColor" opacity="0.4" />
          <circle cx="24" cy="24" r="2" fill="currentColor" />
          <path
            d="M38 18a16 16 0 00-28-2"
            stroke="currentColor"
            className="origin-center group-data-[hover=true]:animate-[spin_3s_linear_infinite]"
          />
          <path d="M40 12v6h-6" stroke="currentColor" />
        </svg>
      );

    default:
      // Generic diamond
      return (
        <svg {...props}>
          <path d="M24 6l18 18-18 18L6 24 24 6z" stroke="currentColor" />
          <path d="M24 14l10 10-10 10-10-10 10-10z" stroke="currentColor" opacity="0.4" />
        </svg>
      );
  }
}

/**
 * Map service title keywords to icon kinds.
 * Allows icons to work regardless of Sanity content ordering.
 */
function matchIcon(kind: string): string {
  const k = kind.toLowerCase();
  if (k.includes("proactive") || k.includes("management")) return "management";
  if (k.includes("helpdesk") || k.includes("support")) return "support";
  if (k.includes("cyber") || k.includes("security")) return "security";
  if (k.includes("cloud") || k.includes("microsoft") || k.includes("365")) return "cloud";
  if (k.includes("backup") || k.includes("disaster") || k.includes("recovery")) return "backup";
  return "default";
}
