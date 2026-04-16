import Link from "next/link";
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
    <footer className="bg-navy px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-sm text-white/60">
            <p className="mb-2 font-semibold text-white/80">Legal</p>
            <div className="flex flex-wrap justify-center gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="underline transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-sm text-white/40">
            &copy; {copyrightYear} by {companyName}, LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
