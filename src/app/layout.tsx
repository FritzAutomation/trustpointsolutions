import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CursorGlow from "@/components/ui/CursorGlow";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import type { SiteSettings } from "@/types";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Trust Point IT Solutions",
    template: "%s | Trust Point IT Solutions",
  },
  description:
    "Managed IT services for growing businesses. Proactive IT management, cybersecurity, cloud support, and more.",
  metadataBase: new URL("https://trustpointitsolutions.com"),
  openGraph: {
    title: "Trust Point IT Solutions",
    description:
      "Managed IT services for growing businesses. Proactive IT management, cybersecurity, cloud support, and more.",
    url: "https://trustpointitsolutions.com",
    siteName: "Trust Point IT Solutions",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: SiteSettings | null = null;
  try {
    settings = await client.fetch<SiteSettings>(siteSettingsQuery);
  } catch {
    // Sanity not configured yet — use fallback values
  }

  const logoUrl = settings?.logo ? urlFor(settings.logo).width(320).url() : undefined;

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="font-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to Main Content
        </a>
        <CursorGlow />
        <Navbar
          logoUrl={logoUrl}
          companyName={settings?.companyName ?? "Trust Point IT Solutions"}
        />
        <main id="main">{children}</main>
        <Footer
          companyName={settings?.companyName ?? "Trust Point IT Solutions"}
          copyrightYear={settings?.copyrightYear ?? "2026"}
          legalLinks={settings?.legalLinks ?? []}
        />
      </body>
    </html>
  );
}
