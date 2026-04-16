import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface SiteSettings {
  companyName: string;
  logo: SanityImageSource;
  contactEmail: string;
  phone?: string;
  copyrightYear: string;
  legalLinks: LegalLink[];
}

export interface LegalLink {
  label: string;
  url: string;
}

export interface HomePage {
  hero: {
    heading: string;
    subheading: PortableTextBlock[];
    ctaText: string;
    backgroundImage?: SanityImageSource;
  };
  servicesHeading: string;
  trustedPartner: {
    heading: string;
    body: PortableTextBlock[];
  };
}

export interface Service {
  _id: string;
  title: string;
  description: PortableTextBlock[];
  tagline: string;
  image?: SanityImageSource;
  order: number;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  content: PortableTextBlock[];
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}
