import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    companyName,
    logo,
    contactEmail,
    phone,
    copyrightYear,
    legalLinks[] {
      label,
      url
    }
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    hero {
      heading,
      subheading,
      ctaText,
      backgroundImage
    },
    servicesHeading,
    trustedPartner {
      heading,
      body
    }
  }
`;

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    description,
    tagline,
    image,
    order
  }
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    content
  }
`;
