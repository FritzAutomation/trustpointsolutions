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
