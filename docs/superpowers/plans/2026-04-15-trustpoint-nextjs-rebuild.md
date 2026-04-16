# Trust Point IT Solutions — Next.js Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild trustpointitsolutions.com from Wix to Next.js 15 + Sanity v3 + Tailwind CSS, deployed on Vercel.

**Architecture:** Single Next.js App Router application with Sanity Studio embedded at `/studio`. Content fetched server-side via GROQ queries with ISR revalidation. Contact form submits to a Next.js API route that sends email via Resend. All content is CMS-editable.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Sanity v3, Resend, Vercel

**Design Spec:** `docs/superpowers/specs/2026-04-15-trustpoint-nextjs-rebuild-design.md`

---

## File Structure

```
trustpointsolutions/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout: fonts, metadata, Navbar, Footer
│   │   ├── page.tsx                        # Homepage: fetches Sanity data, renders sections
│   │   ├── privacy-policy/page.tsx         # Privacy policy (fetched from Sanity `page` doc)
│   │   ├── accessibility/page.tsx          # Accessibility statement (fetched from Sanity `page` doc)
│   │   ├── studio/[[...tool]]/page.tsx     # Sanity Studio embedded route
│   │   └── api/
│   │       ├── contact/route.ts            # Contact form POST handler (Resend)
│   │       └── revalidate/route.ts         # Sanity webhook revalidation endpoint
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                  # Fixed navbar with scroll effect
│   │   │   └── Footer.tsx                  # Footer with logo, legal links, copyright
│   │   ├── sections/
│   │   │   ├── Hero.tsx                    # Hero section with geometric pattern
│   │   │   ├── Services.tsx                # Services grid section
│   │   │   ├── ServiceCard.tsx             # Individual service card
│   │   │   ├── TrustedPartner.tsx          # "Your Trusted IT Partner" section
│   │   │   └── ContactForm.tsx             # Contact form (client component)
│   │   └── ui/
│   │       ├── Button.tsx                  # Reusable button component
│   │       ├── SectionWrapper.tsx          # Consistent section padding/max-width
│   │       └── GeometricPattern.tsx        # SVG triangle pattern for hero
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts                   # Sanity client config
│   │   │   ├── queries.ts                  # All GROQ queries
│   │   │   └── image.ts                    # Image URL builder
│   │   └── email.ts                        # Resend email helper
│   └── types/
│       └── index.ts                        # Shared TypeScript types
├── sanity/
│   ├── schemas/
│   │   ├── index.ts                        # Schema registry
│   │   ├── siteSettings.ts                 # Singleton: company name, logo, contact email
│   │   ├── homePage.ts                     # Singleton: hero, services heading, trusted partner
│   │   ├── service.ts                      # Document: individual service entries
│   │   └── page.ts                         # Document: generic pages (privacy, accessibility)
│   └── lib/
│       └── singletonPlugin.ts              # Helper to enforce singleton documents
├── sanity.config.ts                        # Sanity Studio config (root level for Next.js integration)
├── sanity.cli.ts                           # Sanity CLI config
├── tailwind.config.ts
├── next.config.ts
├── .env.local.example                      # Template for environment variables
├── .gitignore
├── tsconfig.json
└── package.json
```

---

## Task 1: Project Scaffolding & Configuration

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.env.local.example`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

Run from the project root (`C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions`):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

When prompted, accept defaults. This creates the Next.js 15 project with Tailwind and TypeScript pre-configured.

- [ ] **Step 2: Install dependencies**

```bash
npm install next-sanity @sanity/image-url @sanity/vision sanity styled-components resend framer-motion
npm install -D @types/node
```

- `next-sanity`: Sanity integration for Next.js (client, preview, studio embedding)
- `@sanity/image-url`: Build image URLs from Sanity image references
- `@sanity/vision`: GROQ query playground in Sanity Studio
- `sanity` + `styled-components`: Sanity Studio core
- `resend`: Email delivery
- `framer-motion`: Animations

- [ ] **Step 3: Create `.env.local.example`**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/.env.local.example`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Resend
RESEND_API_KEY=your_resend_api_key

# Revalidation
SANITY_REVALIDATE_SECRET=your_revalidation_secret
```

- [ ] **Step 4: Update `.gitignore`**

Append to the existing `.gitignore`:

```
# Environment
.env.local
.env*.local

# Sanity
.sanity/
```

- [ ] **Step 5: Configure `next.config.ts`**

Replace `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 6: Configure Tailwind with brand colors**

Replace `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B1464",
          light: "#2A1F8A",
        },
        accent: {
          DEFAULT: "#2D7DD2",
          light: "#4DACF7",
        },
        surface: {
          DEFAULT: "#F5F5F5",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 7: Set up root layout with Inter font**

Replace `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trust Point IT Solutions",
  description:
    "Managed IT services for growing businesses. Proactive IT management, cybersecurity, cloud support, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder homepage**

Replace `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy">
      <h1 className="text-4xl font-bold text-white">
        Trust Point IT Solutions
      </h1>
      <p className="mt-4 text-accent-light">Site rebuild in progress</p>
    </main>
  );
}
```

- [ ] **Step 9: Update `globals.css`**

Replace `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-surface-white text-navy;
  }
}
```

- [ ] **Step 10: Verify the dev server starts**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. You should see "Trust Point IT Solutions" in white on a navy background.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind and brand colors"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create shared types**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/types/index.ts`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add shared TypeScript types for Sanity content models"
```

---

## Task 3: Sanity Configuration & Schemas

**Files:**
- Create: `sanity.config.ts`, `sanity.cli.ts`, `sanity/schemas/index.ts`, `sanity/schemas/siteSettings.ts`, `sanity/schemas/homePage.ts`, `sanity/schemas/service.ts`, `sanity/schemas/page.ts`, `sanity/lib/singletonPlugin.ts`

**Prerequisites:** You need a Sanity project. Run `npx sanity init` or create one at sanity.io/manage. Note the project ID and dataset name, then add them to `.env.local`.

- [ ] **Step 1: Create `.env.local`**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/.env.local` (this file is gitignored):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=<your_project_id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<your_api_token>
RESEND_API_KEY=<your_resend_api_key>
SANITY_REVALIDATE_SECRET=<generate_a_random_string>
```

- [ ] **Step 2: Create Sanity CLI config**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/sanity.cli.ts`:

```typescript
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  },
});
```

- [ ] **Step 3: Create singleton plugin**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/sanity/lib/singletonPlugin.ts`:

```typescript
import type { DocumentDefinition } from "sanity";
import type { StructureResolver } from "sanity/structure";

export function singletonPlugin(types: string[]) {
  return {
    name: "singletonPlugin",
    document: {
      newDocumentOptions: (prev: DocumentDefinition[], { creationContext }: { creationContext: { type: string } }) => {
        if (creationContext.type === "global") {
          return prev.filter(
            (template: DocumentDefinition) => !types.includes(template.templateId ?? "")
          );
        }
        return prev;
      },
      actions: (prev: any[], { schemaType }: { schemaType: string }) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }: { action: string }) =>
            ["publish", "discardChanges", "restore"].includes(action)
          );
        }
        return prev;
      },
    },
  };
}

export function singletonStructure(
  types: string[]
): StructureResolver {
  return (S) => {
    const singletonItems = types.map((typeName) =>
      S.listItem()
        .title(typeName === "siteSettings" ? "Site Settings" : "Home Page")
        .id(typeName)
        .child(S.document().schemaType(typeName).documentId(typeName))
    );

    const defaultListItems = S.documentTypeListItems().filter(
      (item) => !types.includes(item.getId()!)
    );

    return S.list()
      .title("Content")
      .items([...singletonItems, S.divider(), ...defaultListItems]);
  };
}
```

- [ ] **Step 4: Create siteSettings schema**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/sanity/schemas/siteSettings.ts`:

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Form Email",
      description: "Email address that receives contact form submissions",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "copyrightYear",
      title: "Copyright Year",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
});
```

- [ ] **Step 5: Create homePage schema**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/sanity/schemas/homePage.ts`:

```typescript
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
```

- [ ] **Step 6: Create service schema**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/sanity/schemas/service.ts`:

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
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
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description: "Short punchy line, e.g. 'Fewer disruptions, more uptime.'",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
```

- [ ] **Step 7: Create page schema**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/sanity/schemas/page.ts`:

```typescript
import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
```

- [ ] **Step 8: Create schema registry**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/sanity/schemas/index.ts`:

```typescript
import siteSettings from "./siteSettings";
import homePage from "./homePage";
import service from "./service";
import page from "./page";

export const schemaTypes = [siteSettings, homePage, service, page];
```

- [ ] **Step 9: Create Sanity Studio config**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/sanity.config.ts`:

```typescript
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { singletonPlugin, singletonStructure } from "./sanity/lib/singletonPlugin";

const singletonTypes = ["siteSettings", "homePage"];

export default defineConfig({
  name: "trustpoint-studio",
  title: "Trust Point IT Solutions",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: "/studio",
  plugins: [
    structureTool({ structure: singletonStructure(singletonTypes) }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    singletonPlugin(singletonTypes),
  ],
  schema: {
    types: schemaTypes,
  },
});
```

- [ ] **Step 10: Commit**

```bash
git add sanity/ sanity.config.ts sanity.cli.ts
git commit -m "feat: add Sanity schemas and studio configuration"
```

---

## Task 4: Sanity Client & Queries

**Files:**
- Create: `src/lib/sanity/client.ts`, `src/lib/sanity/queries.ts`, `src/lib/sanity/image.ts`

- [ ] **Step 1: Create Sanity client**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/lib/sanity/client.ts`:

```typescript
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});
```

- [ ] **Step 2: Create image URL builder**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/lib/sanity/image.ts`:

```typescript
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

- [ ] **Step 3: Create GROQ queries**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/lib/sanity/queries.ts`:

```typescript
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
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/sanity/
git commit -m "feat: add Sanity client, image builder, and GROQ queries"
```

---

## Task 5: Sanity Studio Embedded Route

**Files:**
- Create: `src/app/studio/[[...tool]]/page.tsx`

- [ ] **Step 1: Create the Studio route**

Create directories and file at `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/studio/[[...tool]]/page.tsx`:

```tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 2: Verify Studio loads**

Run `npm run dev` and navigate to `http://localhost:3000/studio`. You should see the Sanity Studio interface with "Site Settings", "Home Page" singletons and "Service", "Page" document lists.

Note: You need valid `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local` for this to work.

- [ ] **Step 3: Commit**

```bash
git add src/app/studio/
git commit -m "feat: embed Sanity Studio at /studio route"
```

---

## Task 6: Seed Sanity Content

**Purpose:** Populate Sanity with the current site's content so the frontend has data to render.

- [ ] **Step 1: Open Sanity Studio and create Site Settings**

Navigate to `http://localhost:3000/studio` and create the **Site Settings** document:

- Company Name: `Trust Point IT Solutions`
- Contact Email: `JFritzjunker@fritzautomation.dev`
- Copyright Year: `2026`
- Legal Links:
  - `{ label: "Privacy Policy", url: "/privacy-policy" }`
  - `{ label: "Accessibility Statement", url: "/accessibility" }`

Upload the Trust Point logo (download from the current Wix site first).

- [ ] **Step 2: Create the Home Page document**

In Sanity Studio, create the **Home Page** document:

- Hero Heading: `You run the business — We handle the IT`
- Hero Subheading: `Your technology should help your business move faster, not get in the way. As your Managed Service Provider, we take ownership of your IT—monitoring, securing, and supporting everything behind the scenes—so you can stay focused on running and growing your company.` (new paragraph) `You get a partner who knows your business—not just your network.`
- Hero CTA Text: `Contact us`
- Services Heading: `SERVICES`
- Trusted Partner Heading: `YOUR TRUSTED IT PARTNER`
- Trusted Partner Body: `Helping you make confident technology decisions that fit your budget, your people, and your vision for the future.`

- [ ] **Step 3: Create the 5 Service documents**

Create each service in Sanity Studio:

1. **Proactive IT Management** (order: 1)
   - Description: `We monitor and maintain your systems 24/7 to prevent issues before they impact your operations.`
   - Tagline: `Fewer disruptions, more uptime.`

2. **Reliable Helpdesk Support** (order: 2)
   - Description: `When something breaks, you need answers — fast.`
   - Tagline: `Fast resolution, clear communication, no frustration.`

3. **Cybersecurity Protection** (order: 3)
   - Description: `We safeguard your business against modern threats with layered security, endpoint protection, backups, and best-practice policies.`
   - Tagline: `Stronger defenses, fewer vulnerabilities, total peace of mind.`

4. **Cloud & Microsoft 365 Support** (order: 4)
   - Description: `From email and collaboration to cloud infrastructure, we manage and optimize the tools your team relies on every day.`
   - Tagline: `Your cloud, streamlined, secured, and always working for you.`

5. **Backup & Disaster Recovery** (order: 5)
   - Description: `We ensure your critical data is backed up and recoverable, so your business can quickly recover from unexpected events.`
   - Tagline: `When the unexpected hits, your business doesn't miss a beat.`

- [ ] **Step 4: Create Privacy Policy and Accessibility pages**

Create two **Page** documents:

1. **Privacy Policy** (slug: `privacy-policy`)
   - Content: Copy from the current Wix site's privacy policy page

2. **Accessibility Statement** (slug: `accessibility`)
   - Content: Copy from the current Wix site's accessibility statement page

---

## Task 7: UI Components

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/SectionWrapper.tsx`, `src/components/ui/GeometricPattern.tsx`

- [ ] **Step 1: Create Button component**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/ui/Button.tsx`:

```tsx
import Link from "next/link";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export default function Button({
  href,
  onClick,
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent-light",
    outline:
      "border-2 border-white text-white hover:bg-white hover:text-navy",
  };

  const styles = `${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create SectionWrapper component**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/ui/SectionWrapper.tsx`:

```tsx
interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionWrapper({
  children,
  className = "",
  id,
}: SectionWrapperProps) {
  return (
    <section id={id} className={`px-4 py-16 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
```

- [ ] **Step 3: Create GeometricPattern component**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/ui/GeometricPattern.tsx`:

```tsx
export default function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute right-0 top-0 h-full w-1/2 opacity-30 ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Large triangles */}
      <polygon points="200,0 400,200 200,200" fill="#2D7DD2" opacity="0.6" />
      <polygon points="300,0 400,0 400,100" fill="#4DACF7" opacity="0.8" />
      <polygon points="250,50 350,150 250,150" fill="#2D7DD2" opacity="0.4" />

      {/* Medium triangles */}
      <polygon points="320,80 400,160 320,160" fill="#4DACF7" opacity="0.5" />
      <polygon points="200,100 280,180 200,180" fill="#2D7DD2" opacity="0.3" />
      <polygon points="350,200 400,250 350,250" fill="#4DACF7" opacity="0.6" />

      {/* Small accent triangles */}
      <polygon points="280,20 310,50 280,50" fill="#FFFFFF" opacity="0.3" />
      <polygon points="360,120 380,140 360,140" fill="#FFFFFF" opacity="0.2" />
      <polygon points="220,160 250,190 220,190" fill="#4DACF7" opacity="0.4" />
      <polygon points="300,220 340,260 300,260" fill="#2D7DD2" opacity="0.5" />
      <polygon points="340,280 400,340 340,340" fill="#4DACF7" opacity="0.3" />
      <polygon points="250,300 300,350 250,350" fill="#2D7DD2" opacity="0.2" />
    </svg>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add Button, SectionWrapper, and GeometricPattern UI components"
```

---

## Task 8: Layout Components (Navbar & Footer)

**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Navbar**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/layout/Navbar.tsx`:

```tsx
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
```

- [ ] **Step 2: Create Footer**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/layout/Footer.tsx`:

```tsx
import Link from "next/link";
import type { LegalLink } from "@/types";

interface FooterProps {
  companyName: string;
  copyrightYear: string;
  legalLinks: LegalLink[];
}

export default function Footer({
  companyName,
  copyrightYear,
  legalLinks,
}: FooterProps) {
  return (
    <footer className="bg-navy px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-sm text-white/60">
            <p className="mb-2 font-semibold text-white/80">Legal</p>
            <div className="flex flex-wrap justify-center gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="underline transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-sm text-white/40">
            &copy; {copyrightYear} by {companyName}, LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Update root layout to include Navbar and Footer**

Replace `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import type { SiteSettings } from "@/types";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trust Point IT Solutions",
  description:
    "Managed IT services for growing businesses. Proactive IT management, cybersecurity, cloud support, and more.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings: SiteSettings = await client.fetch(siteSettingsQuery);

  const logoUrl = settings?.logo ? urlFor(settings.logo).width(320).url() : undefined;

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to Main Content
        </a>
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
```

- [ ] **Step 4: Verify layout renders**

Run `npm run dev`. The page should show the Navbar fixed at top and Footer at bottom. If Sanity isn't seeded yet, fallback values will display.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/ src/app/layout.tsx
git commit -m "feat: add Navbar and Footer layout components with Sanity data"
```

---

## Task 9: Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Create Hero component**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/sections/Hero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import Button from "@/components/ui/Button";
import GeometricPattern from "@/components/ui/GeometricPattern";

interface HeroProps {
  heading: string;
  subheading: PortableTextBlock[];
  ctaText: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Hero({ heading, subheading, ctaText }: HeroProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy">
      <GeometricPattern />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.h1
            className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            {heading}
          </motion.h1>
          <motion.div
            className="mt-6 space-y-4 text-lg text-white/80"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <PortableText value={subheading} />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <Button href="#contact" variant="primary" className="mt-8">
              {ctaText}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: add Hero section with animations and geometric pattern"
```

---

## Task 10: Services Section

**Files:**
- Create: `src/components/sections/ServiceCard.tsx`, `src/components/sections/Services.tsx`

- [ ] **Step 1: Create ServiceCard component**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/sections/ServiceCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PortableText } from "next-sanity";
import type { Service } from "@/types";
import { urlFor } from "@/lib/sanity/image";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      className="flex flex-col rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      {service.image && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <Image
            src={urlFor(service.image).width(400).height(250).url()}
            alt={service.title}
            width={400}
            height={250}
            className="h-48 w-full object-cover"
          />
        </div>
      )}
      <h3 className="text-xl font-bold text-navy">{service.title}</h3>
      <div className="mt-2 flex-1 text-navy/70">
        <PortableText value={service.description} />
      </div>
      {service.tagline && (
        <p className="mt-4 font-semibold text-accent">{service.tagline}</p>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Create Services section**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/sections/Services.tsx`:

```tsx
import SectionWrapper from "@/components/ui/SectionWrapper";
import ServiceCard from "./ServiceCard";
import type { Service } from "@/types";

interface ServicesProps {
  heading: string;
  services: Service[];
}

export default function Services({ heading, services }: ServicesProps) {
  return (
    <SectionWrapper className="bg-surface" id="services">
      <h2 className="mb-12 text-3xl font-bold text-navy">{heading}</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={service._id} service={service} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ServiceCard.tsx src/components/sections/Services.tsx
git commit -m "feat: add Services section with animated cards"
```

---

## Task 11: Trusted Partner Section

**Files:**
- Create: `src/components/sections/TrustedPartner.tsx`

- [ ] **Step 1: Create TrustedPartner component**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/sections/TrustedPartner.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import SectionWrapper from "@/components/ui/SectionWrapper";

interface TrustedPartnerProps {
  heading: string;
  body: PortableTextBlock[];
}

export default function TrustedPartner({ heading, body }: TrustedPartnerProps) {
  return (
    <SectionWrapper className="bg-navy text-white">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
        <div className="mt-6 text-lg text-white/80">
          <PortableText value={body} />
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/TrustedPartner.tsx
git commit -m "feat: add Trusted Partner section"
```

---

## Task 12: Contact Form

**Files:**
- Create: `src/components/sections/ContactForm.tsx`, `src/lib/email.ts`, `src/app/api/contact/route.ts`

- [ ] **Step 1: Create the email helper**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/lib/email.ts`:

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendContactEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContactEmail({
  to,
  firstName,
  lastName,
  email,
  phone,
  message,
}: SendContactEmailParams) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return resend.emails.send({
    from: "Trust Point IT Solutions <noreply@trustpointitsolutions.com>",
    to,
    replyTo: email,
    subject: "New Contact Form Submission — Trust Point IT Solutions",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1B1464;">New Contact Form Submission</h2>
        <hr style="border: 1px solid #eee;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #1B1464;">Name</td>
            <td style="padding: 8px 0;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #1B1464;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `<tr>
            <td style="padding: 8px 0; font-weight: bold; color: #1B1464;">Phone</td>
            <td style="padding: 8px 0;">${phone}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #1B1464;">Message</td>
            <td style="padding: 8px 0;">${message}</td>
          </tr>
        </table>
        <hr style="border: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">Submitted on ${timestamp}</p>
      </div>
    `,
  });
}
```

- [ ] **Step 2: Create the API route**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const timestamps = submissions.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < windowMs);
  submissions.set(ip, recent);

  if (recent.length >= maxRequests) return true;

  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    // Validate required fields
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "First name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Get contact email from Sanity, fall back to env var
    let toEmail = process.env.CONTACT_EMAIL_FALLBACK ?? "JFritzjunker@fritzautomation.dev";
    try {
      const settings = await client.fetch(siteSettingsQuery);
      if (settings?.contactEmail) {
        toEmail = settings.contactEmail;
      }
    } catch {
      // Use fallback email if Sanity fetch fails
    }

    await sendContactEmail({
      to: toEmail,
      firstName,
      lastName: lastName ?? "",
      email,
      phone: phone ?? "",
      message,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Create ContactForm component**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/components/sections/ContactForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { ContactFormData } from "@/types";
import Button from "@/components/ui/Button";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <SectionWrapper className="bg-navy" id="contact">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-8 text-center text-3xl font-bold text-white">
          Contact Us
        </h2>

        {status === "success" ? (
          <div className="rounded-lg bg-white/10 p-8 text-center">
            <p className="text-lg font-semibold text-white">
              Thank you for reaching out!
            </p>
            <p className="mt-2 text-white/70">
              We&apos;ll get back to you as soon as possible.
            </p>
            <Button
              onClick={() => setStatus("idle")}
              variant="outline"
              className="mt-6"
            >
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-white/80">
                  First name <span className="text-accent-light">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-white/80">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-white/80">
                  Email <span className="text-accent-light">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-white/80">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-white/80">
                Message <span className="text-accent-light">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={status === "sending"}
              className="w-full"
            >
              {status === "sending" ? "Sending..." : "Submit"}
            </Button>
          </form>
        )}
      </div>
    </SectionWrapper>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/email.ts src/app/api/contact/ src/components/sections/ContactForm.tsx
git commit -m "feat: add contact form with Resend email integration"
```

---

## Task 13: Homepage Assembly

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Wire up the homepage**

Replace `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/page.tsx`:

```tsx
import { client } from "@/lib/sanity/client";
import { homePageQuery, servicesQuery } from "@/lib/sanity/queries";
import type { HomePage, Service } from "@/types";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import TrustedPartner from "@/components/sections/TrustedPartner";
import ContactForm from "@/components/sections/ContactForm";

export const revalidate = 60;

export default async function Home() {
  const [homePage, services] = await Promise.all([
    client.fetch<HomePage>(homePageQuery),
    client.fetch<Service[]>(servicesQuery),
  ]);

  return (
    <>
      <Hero
        heading={homePage.hero.heading}
        subheading={homePage.hero.subheading}
        ctaText={homePage.hero.ctaText}
      />
      <Services
        heading={homePage.servicesHeading}
        services={services}
      />
      <TrustedPartner
        heading={homePage.trustedPartner.heading}
        body={homePage.trustedPartner.body}
      />
      <ContactForm />
    </>
  );
}
```

- [ ] **Step 2: Verify the full homepage renders**

Run `npm run dev` and check `http://localhost:3000`. All four sections should render with Sanity content (or gracefully handle missing content if not yet seeded).

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble homepage with all sections from Sanity"
```

---

## Task 14: Static Pages (Privacy Policy & Accessibility)

**Files:**
- Create: `src/app/privacy-policy/page.tsx`, `src/app/accessibility/page.tsx`

- [ ] **Step 1: Create Privacy Policy page**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/privacy-policy/page.tsx`:

```tsx
import { client } from "@/lib/sanity/client";
import { pageBySlugQuery } from "@/lib/sanity/queries";
import { PortableText } from "next-sanity";
import type { Page } from "@/types";
import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy Policy | Trust Point IT Solutions",
};

export default async function PrivacyPolicyPage() {
  const page = await client.fetch<Page>(pageBySlugQuery, {
    slug: "privacy-policy",
  });

  return (
    <SectionWrapper className="pt-32">
      <h1 className="mb-8 text-4xl font-bold text-navy">
        {page?.title ?? "Privacy Policy"}
      </h1>
      <div className="prose prose-lg max-w-none text-navy/80">
        {page?.content ? (
          <PortableText value={page.content} />
        ) : (
          <p>Privacy policy content coming soon.</p>
        )}
      </div>
    </SectionWrapper>
  );
}
```

- [ ] **Step 2: Create Accessibility page**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/accessibility/page.tsx`:

```tsx
import { client } from "@/lib/sanity/client";
import { pageBySlugQuery } from "@/lib/sanity/queries";
import { PortableText } from "next-sanity";
import type { Page } from "@/types";
import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Accessibility Statement | Trust Point IT Solutions",
};

export default async function AccessibilityPage() {
  const page = await client.fetch<Page>(pageBySlugQuery, {
    slug: "accessibility",
  });

  return (
    <SectionWrapper className="pt-32">
      <h1 className="mb-8 text-4xl font-bold text-navy">
        {page?.title ?? "Accessibility Statement"}
      </h1>
      <div className="prose prose-lg max-w-none text-navy/80">
        {page?.content ? (
          <PortableText value={page.content} />
        ) : (
          <p>Accessibility statement content coming soon.</p>
        )}
      </div>
    </SectionWrapper>
  );
}
```

- [ ] **Step 3: Install Tailwind Typography plugin for prose styles**

```bash
npm install @tailwindcss/typography
```

Update `tailwind.config.ts` — add to the plugins array:

```typescript
plugins: [require("@tailwindcss/typography")],
```

- [ ] **Step 4: Commit**

```bash
git add src/app/privacy-policy/ src/app/accessibility/ tailwind.config.ts package.json package-lock.json
git commit -m "feat: add Privacy Policy and Accessibility pages with Sanity content"
```

---

## Task 15: Revalidation Webhook

**Files:**
- Create: `src/app/api/revalidate/route.ts`

- [ ] **Step 1: Create revalidation API route**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/api/revalidate/route.ts`:

```typescript
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Revalidate all pages — simple and effective for a small site
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
```

After deployment, configure a Sanity webhook at `sanity.io/manage` pointing to:
`https://trustpointitsolutions.com/api/revalidate?secret=YOUR_SECRET`

- [ ] **Step 2: Commit**

```bash
git add src/app/api/revalidate/
git commit -m "feat: add Sanity webhook revalidation endpoint"
```

---

## Task 16: SEO & Metadata

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`

- [ ] **Step 1: Add JSON-LD structured data to homepage**

Add to the top of the return in `src/app/page.tsx`, inside the `<>` fragment, before `<Hero>`:

```tsx
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
```

- [ ] **Step 2: Create sitemap**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://trustpointitsolutions.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
```

- [ ] **Step 3: Create robots.txt**

Create `C:/Users/Joshua/Desktop/Josh/Python/trustpointsolutions/src/app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio/",
    },
    sitemap: "https://trustpointitsolutions.com/sitemap.xml",
  };
}
```

- [ ] **Step 4: Enhance root layout metadata with Open Graph**

Update the `metadata` export in `src/app/layout.tsx`:

```typescript
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
```

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/page.tsx src/app/layout.tsx
git commit -m "feat: add SEO metadata, sitemap, robots.txt, and JSON-LD"
```

---

## Task 17: Final Verification & Build

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected: Build completes with no errors. Check for any TypeScript or linting errors in the output.

- [ ] **Step 2: Run the production server locally**

```bash
npm run start
```

Open `http://localhost:3000` and verify:
- Navbar renders with logo (or fallback text) and Contact Us button
- Hero section shows with gradient, geometric pattern, heading, body, CTA
- Services section shows all 5 service cards in a grid
- Trusted Partner section renders with navy background
- Contact form renders and validates required fields
- Footer shows legal links and copyright
- Privacy Policy and Accessibility pages render at their URLs
- Sanity Studio loads at `/studio`
- All animations play smoothly
- Site is responsive at mobile, tablet, and desktop widths

- [ ] **Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "fix: address any build/verification issues"
```

(Skip this commit if no fixes were needed.)

- [ ] **Step 4: Push to GitHub**

```bash
git push -u origin main
```

This triggers the first Vercel deployment. Verify it succeeds in the Vercel dashboard.
