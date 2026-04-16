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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-navy/95 shadow-lg backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={companyName}
              width={160}
              height={48}
              className="h-10 w-auto"
              priority
            />
          ) : (
            <span className="text-xl font-bold text-white">{companyName}</span>
          )}
        </Link>
        <Button href="#contact" variant="primary">
          Contact Us
        </Button>
      </div>
    </nav>
  );
}
