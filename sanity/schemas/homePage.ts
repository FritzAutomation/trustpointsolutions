import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "ctaText",
          title: "CTA Button Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "backgroundImage",
          title: "Background Image",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "servicesHeading",
      title: "Services Section Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "identitySpotlight",
      title: "Identity Spotlight (ITDR)",
      description:
        "The \"Attackers don't break in — they log in\" feature section.",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow Label",
          description: "Small uppercase label above the heading",
          type: "string",
        }),
        defineField({
          name: "heading",
          title: "Headline",
          description: "Main statement (e.g. \"Attackers don't break in.\")",
          type: "string",
        }),
        defineField({
          name: "headingEmphasis",
          title: "Emphasized Continuation",
          description: "Highlighted follow-up (e.g. \"They log in.\")",
          type: "string",
        }),
        defineField({
          name: "intro",
          title: "Intro Paragraph",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "callouts",
          title: "Callouts",
          description: "2–4 short callout cards explaining the value",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 3,
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "description" },
              },
            },
          ],
          validation: (Rule) => Rule.max(4),
        }),
        defineField({
          name: "closing",
          title: "Closing Line",
          description: "Short line that wraps the section",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "pullQuotes",
      title: "Pull Quotes",
      description:
        "Large feature quotes placed between sections. Use `placement` to control where each appears.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "placement",
              title: "Placement",
              description: "Where on the page this quote appears",
              type: "string",
              options: {
                list: [
                  { title: "After Services", value: "after-services" },
                  { title: "After Identity Spotlight", value: "after-identity" },
                  { title: "After Stack Effect", value: "after-stack-effect" },
                  { title: "After Process", value: "after-process" },
                  { title: "After One Price", value: "after-one-price" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "text",
              title: "Quote Text",
              type: "text",
              rows: 2,
              validation: (Rule) => Rule.required().max(140),
            }),
            defineField({
              name: "attribution",
              title: "Attribution (optional)",
              description:
                "Optional source — leave blank for anonymous marketing quotes",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "text", subtitle: "placement" },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "trustedPartner",
      title: "Trusted Partner Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "array",
          of: [{ type: "block" }],
        }),
      ],
    }),
  ],
});
