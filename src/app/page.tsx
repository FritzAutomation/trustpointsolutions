import { client } from "@/lib/sanity/client";
import { homePageQuery, servicesQuery } from "@/lib/sanity/queries";
import type {
  HomePage,
  PullQuote as PullQuoteData,
  PullQuotePlacement,
  Service,
} from "@/types";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import IdentitySpotlight from "@/components/sections/IdentitySpotlight";
import StackEffect from "@/components/sections/StackEffect";
import Process from "@/components/sections/Process";
import OnePrice from "@/components/sections/OnePrice";
import TrustedPartner from "@/components/sections/TrustedPartner";
import ContactForm from "@/components/sections/ContactForm";
import PullQuote from "@/components/ui/PullQuote";

export const revalidate = 60;

// Fallback content — used when Sanity is unavailable.
const fallbackHomePage: HomePage = {
  hero: {
    heading: "You run the business — We handle the IT",
    subheading: [
      {
        _type: "block",
        _key: "hero-p1",
        children: [
          {
            _type: "span",
            _key: "hero-p1-span",
            text: "A layered, fully integrated security and support stack that works as hard as you do — covering every angle, every day, for one fixed monthly price.",
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _type: "block",
        _key: "hero-p2",
        children: [
          {
            _type: "span",
            _key: "hero-p2-span",
            text: "Because \"we'll deal with it if something happens\" is not a security strategy.",
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    ctaText: "Let's talk",
  },
  servicesHeading: "SERVICES",
  // Identity spotlight content defaults are baked into the component —
  // leaving this undefined keeps the component using its own defaults.
  identitySpotlight: undefined,
  // Two curated pull quotes pulled from the client's marketing copy.
  pullQuotes: [
    {
      placement: "after-services",
      text: "It's the difference between a fire alarm and a fire department.",
    },
    {
      placement: "after-stack-effect",
      text: "The best firewall is an informed workforce.",
    },
  ],
  trustedPartner: {
    heading: "YOUR TRUSTED IT PARTNER",
    body: [
      {
        _type: "block",
        _key: "tp-p1",
        children: [
          {
            _type: "span",
            _key: "tp-p1-span",
            text: "Helping you make confident technology decisions that fit your budget, your people, and your vision for the future.",
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
};

const fallbackServices: Service[] = [
  {
    _id: "fallback-1",
    title: "Proactive IT Management",
    description: [
      {
        _type: "block",
        _key: "s1-p1",
        children: [
          {
            _type: "span",
            _key: "s1-p1-span",
            text: "Every device, server, and workstation under continuous watch. Our RMM platform fires alerts before problems become disasters — and handles the routine remediation, patching, and asset tracking from one pane of glass.",
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    tagline: "Fewer disruptions, more uptime.",
    order: 1,
  },
  {
    _id: "fallback-2",
    title: "Reliable Helpdesk Support",
    description: [
      {
        _type: "block",
        _key: "s2-p1",
        children: [
          {
            _type: "span",
            _key: "s2-p1-span",
            text: "When something breaks, you need answers — fast. Real technicians who know your environment, clear communication on timelines, and no tier-one runaround designed to make problems someone else's job.",
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    tagline: "Fast resolution, clear communication, no frustration.",
    order: 2,
  },
  {
    _id: "fallback-3",
    title: "Cybersecurity Protection",
    description: [
      {
        _type: "block",
        _key: "s3-p1",
        children: [
          {
            _type: "span",
            _key: "s3-p1-span",
            text: "Multi-layered defense — endpoint, email, DNS, identity — that catches what single-layer tools miss. 24/7 human-backed threat hunting, behavioral analysis, and identity-aware detection for the attack that simply logs in with stolen credentials.",
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    tagline: "Stronger defenses, fewer vulnerabilities, total peace of mind.",
    order: 3,
  },
  {
    _id: "fallback-4",
    title: "Cloud & Microsoft 365 Support",
    description: [
      {
        _type: "block",
        _key: "s4-p1",
        children: [
          {
            _type: "span",
            _key: "s4-p1-span",
            text: "We deploy and manage Microsoft 365 Business Premium — Defender, Azure AD, Intune, Information Protection — so every login, device, and document is governed by the same set of smart, auditable policies.",
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    tagline: "Your cloud, streamlined, secured, and always working for you.",
    order: 4,
  },
  {
    _id: "fallback-5",
    title: "Backup & Disaster Recovery",
    description: [
      {
        _type: "block",
        _key: "s5-p1",
        children: [
          {
            _type: "span",
            _key: "s5-p1-span",
            text: "Automated, encrypted, offsite backups of physical servers and Microsoft 365 data — yes, Microsoft doesn't fully back up your cloud, we handle that. When ransomware or hardware failure hits, recovery is measured in hours, not weeks.",
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    tagline: "When the unexpected hits, your business doesn't miss a beat.",
    order: 5,
  },
];

/**
 * Each pull quote placement is associated with a dark/light hint — the
 * section it follows dictates which palette the quote renders against.
 */
const placementIsDark: Record<PullQuotePlacement, boolean> = {
  "after-services": false,        // Services is light → quote is light
  "after-identity": true,         // Identity spotlight is dark
  "after-stack-effect": true,     // Stack Effect is dark
  "after-process": false,         // Process is light
  "after-one-price": false,       // One Price is light
};

/** Find the first pull quote matching a placement, if any. */
function findQuote(
  quotes: PullQuoteData[] | undefined,
  placement: PullQuotePlacement
): PullQuoteData | undefined {
  return quotes?.find((q) => q.placement === placement);
}

export default async function Home() {
  let homePage: HomePage = fallbackHomePage;
  let services: Service[] = fallbackServices;

  try {
    const [fetchedHome, fetchedServices] = await Promise.all([
      client.fetch<HomePage | null>(homePageQuery),
      client.fetch<Service[]>(servicesQuery),
    ]);
    if (fetchedHome) homePage = fetchedHome;
    if (fetchedServices && fetchedServices.length > 0) services = fetchedServices;
  } catch {
    // Use fallback content
  }

  const quotes = homePage.pullQuotes;
  const qAfterServices = findQuote(quotes, "after-services");
  const qAfterIdentity = findQuote(quotes, "after-identity");
  const qAfterStack = findQuote(quotes, "after-stack-effect");
  const qAfterProcess = findQuote(quotes, "after-process");
  const qAfterOnePrice = findQuote(quotes, "after-one-price");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Trust Point IT Solutions",
            description:
              "Managed IT services for growing businesses. A layered security and support stack built for one fixed monthly price.",
            url: "https://trustpointitsolutions.com",
            serviceType: "Managed IT Services",
          }),
        }}
      />
      <Hero
        heading={homePage.hero.heading}
        subheading={homePage.hero.subheading}
        ctaText={homePage.hero.ctaText}
      />
      <Stats />
      <Services heading={homePage.servicesHeading} services={services} />
      {qAfterServices && (
        <PullQuote quote={qAfterServices} dark={placementIsDark["after-services"]} />
      )}
      <IdentitySpotlight content={homePage.identitySpotlight} />
      {qAfterIdentity && (
        <PullQuote quote={qAfterIdentity} dark={placementIsDark["after-identity"]} />
      )}
      <StackEffect />
      {qAfterStack && (
        <PullQuote quote={qAfterStack} dark={placementIsDark["after-stack-effect"]} />
      )}
      <Process />
      {qAfterProcess && (
        <PullQuote quote={qAfterProcess} dark={placementIsDark["after-process"]} />
      )}
      <OnePrice />
      {qAfterOnePrice && (
        <PullQuote quote={qAfterOnePrice} dark={placementIsDark["after-one-price"]} />
      )}
      <TrustedPartner
        heading={homePage.trustedPartner.heading}
        body={homePage.trustedPartner.body}
      />
      <ContactForm />
    </>
  );
}
