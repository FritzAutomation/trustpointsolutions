import { client } from "@/lib/sanity/client";
import { homePageQuery, servicesQuery } from "@/lib/sanity/queries";
import type { HomePage, Service } from "@/types";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import TrustedPartner from "@/components/sections/TrustedPartner";
import ContactForm from "@/components/sections/ContactForm";

export const revalidate = 60;

// Fallback content used when Sanity is unavailable (e.g. during local dev without env vars)
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
            text: "Your technology should help your business move faster, not get in the way. As your Managed Service Provider, we take ownership of your IT—monitoring, securing, and supporting everything behind the scenes—so you can stay focused on running and growing your company.",
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
            text: "You get a partner who knows your business—not just your network.",
            marks: [],
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
    ctaText: "Contact us",
  },
  servicesHeading: "SERVICES",
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
        children: [{ _type: "span", _key: "s1-p1-span", text: "We monitor and maintain your systems 24/7 to prevent issues before they impact your operations.", marks: [] }],
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
        children: [{ _type: "span", _key: "s2-p1-span", text: "When something breaks, you need answers — fast.", marks: [] }],
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
        children: [{ _type: "span", _key: "s3-p1-span", text: "We safeguard your business against modern threats with layered security, endpoint protection, backups, and best-practice policies.", marks: [] }],
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
        children: [{ _type: "span", _key: "s4-p1-span", text: "From email and collaboration to cloud infrastructure, we manage and optimize the tools your team relies on every day.", marks: [] }],
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
        children: [{ _type: "span", _key: "s5-p1-span", text: "We ensure your critical data is backed up and recoverable, so your business can quickly recover from unexpected events.", marks: [] }],
        markDefs: [],
        style: "normal",
      },
    ],
    tagline: "When the unexpected hits, your business doesn't miss a beat.",
    order: 5,
  },
];

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
              "Managed IT services for growing businesses. Proactive IT management, cybersecurity, cloud support, and more.",
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
      <Process />
      <TrustedPartner
        heading={homePage.trustedPartner.heading}
        body={homePage.trustedPartner.body}
      />
      <ContactForm />
    </>
  );
}
