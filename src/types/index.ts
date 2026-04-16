import type { PortableTextBlock } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";

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

export interface IdentityCallout {
  title: string;
  description: string;
}

export interface IdentitySpotlightContent {
  eyebrow?: string;
  heading?: string;
  headingEmphasis?: string;
  intro?: string;
  callouts?: IdentityCallout[];
  closing?: string;
}

/**
 * Where a pull quote is placed on the homepage. Components reading
 * pullQuotes filter by this value to render at the right spot.
 */
export type PullQuotePlacement =
  | "after-services"
  | "after-identity"
  | "after-stack-effect"
  | "after-process"
  | "after-one-price";

export interface PullQuote {
  placement: PullQuotePlacement;
  text: string;
  attribution?: string;
}

export interface HomePage {
  hero: {
    heading: string;
    subheading: PortableTextBlock[];
    ctaText: string;
    backgroundImage?: SanityImageSource;
  };
  servicesHeading: string;
  identitySpotlight?: IdentitySpotlightContent;
  pullQuotes?: PullQuote[];
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
