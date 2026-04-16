"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface NavbarProps {
  logoUrl?: string;
  companyName: string;
}

export default function Navbar({ logoUrl, companyName }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-navy-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={companyName}
              width={160}
              height={48}
              className="h-9 w-auto"
              priority
            />
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Brand mark — circuit-board motif from real logo */}
              <Image
                src="/logos/logo-mark.png"
                alt=""
                width={36}
                height={36}
                className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[10deg]"
                priority
              />
              <span className="font-display text-base font-semibold tracking-tight text-white">
                {companyName}
              </span>
            </div>
          )}
        </Link>

        {/* Nav links (subtle) */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#services"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Services
          </Link>
          <Link
            href="#process"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Process
          </Link>
          <Link
            href="#contact"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Contact
          </Link>
        </div>

        <Button href="#contact" variant="primary" className="!px-5 !py-2.5 !text-xs">
          Get in touch
        </Button>
      </div>
    </nav>
  );
}
