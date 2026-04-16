import Link from "next/link";
import Image from "next/image";
import type { LegalLink } from "@/types";

interface FooterProps {
  companyName: string;
  copyrightYear: string;
  legalLinks: LegalLink[];
}

export default function Footer({
  companyName,
  copyrightYear,
  legalLinks,
}: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-navy-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand mark */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/logos/logo-mark.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 opacity-90"
            />
            <span className="font-display text-sm font-medium text-white/80">
              {companyName}
            </span>
          </div>

          {/* Legal links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="font-mono-ui text-xs text-white/40 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="font-mono-ui text-xs text-white/30">
            © {copyrightYear} {companyName}, LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
