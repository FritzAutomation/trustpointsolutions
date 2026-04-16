# Trust Point IT Solutions — Next.js Rebuild Design Spec

## Overview

Rebuild trustpointitsolutions.com from Wix to a modern Next.js stack. The client is an MSP (Managed Service Provider) startup. The owner is a site IT lead at a CNH facility launching his own IT services business. The current Wix site is functional but feels templated, is bloated (10+ console errors, heavy scripts), and limits future expansion.

**Goals:**
- Match the current brand identity (navy/blue palette, geometric triangle accents) but elevate the design — better typography, spacing, subtle animations
- Give the client a CMS to manage their own content
- Build on a foundation that supports future expansion (blog, portal, additional pages)
- Fast, accessible, SEO-optimized

**Client:** Trust Point IT Solutions, LLC
**Developer:** Joshua (FritzAutomation)
**Repo:** github.com/FritzAutomation/trustpointsolutions

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | Server components, file-based routing, native Vercel integration |
| Styling | Tailwind CSS | Utility-first, fast to build, easy to maintain |
| Animation | Framer Motion | Subtle scroll/load animations for polish |
| CMS | Sanity v3 | Embedded studio, generous free tier, real-time preview, GROQ queries |
| Email | Resend (Pro account) | Contact form delivery, domain-verified transactional email |
| Hosting | Vercel (Pro account) | Auto-deploy from git, CDN, preview deployments, environment variables |
| Language | TypeScript | Type safety across frontend and CMS schemas |

## Project Structure

```
trustpointsolutions/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata, nav, footer)
│   │   ├── page.tsx                # Homepage
│   │   ├── privacy-policy/
│   │   │   └── page.tsx
│   │   ├── accessibility/
│   │   │   └── page.tsx
│   │   ├── studio/
│   │   │   └── [[...tool]]/
│   │   │       └── page.tsx        # Sanity Studio embedded route
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts        # Contact form endpoint
│   ├── components/
│   │   ├── layout/                 # Navbar, Footer
│   │   ├── sections/               # Hero, Services, TrustedPartner, ContactForm
│   │   └── ui/                     # Button, Card, SectionWrapper
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts           # Sanity client config
│   │   │   ├── queries.ts          # GROQ queries
│   │   │   └── image.ts            # Image URL builder
│   │   └── resend.ts               # Email helper
│   └── types/
│       └── index.ts                # Shared TypeScript types
├── sanity/
│   ├── schemas/
│   │   ├── siteSettings.ts
│   │   ├── homePage.ts
│   │   ├── service.ts
│   │   └── page.ts
│   ├── sanity.config.ts
│   └── sanity.cli.ts
├── public/                         # Static assets (logo, OG image)
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Content Model (Sanity Schemas)

### `siteSettings` (singleton)

| Field | Type | Notes |
|-------|------|-------|
| `companyName` | string | "Trust Point IT Solutions" |
| `logo` | image | Company logo |
| `contactEmail` | string | Where form submissions go (currently JFritzjunker@fritzautomation.dev, swap to client later) |
| `phone` | string | Optional, for future use |
| `copyrightYear` | string | Footer copyright |
| `legalLinks` | array of `{ label, url }` | Privacy Policy, Accessibility Statement |

### `homePage` (singleton)

| Field | Type | Notes |
|-------|------|-------|
| `hero.heading` | string | "You run the business — We handle the IT" |
| `hero.subheading` | rich text (portable text) | Body paragraph below heading |
| `hero.ctaText` | string | "Contact us" |
| `hero.backgroundImage` | image | Fallback for gradient/pattern |
| `servicesHeading` | string | "SERVICES" |
| `trustedPartner.heading` | string | "YOUR TRUSTED IT PARTNER" |
| `trustedPartner.body` | rich text | Body text |

### `service` (document, multiple)

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | e.g., "Proactive IT Management" |
| `description` | rich text | Main description |
| `tagline` | string | Punchy one-liner, e.g., "Fewer disruptions, more uptime." |
| `image` | image | Optional service illustration |
| `order` | number | Controls display order on homepage |

### `page` (document, multiple)

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Page title |
| `slug` | slug | URL path |
| `content` | rich text (portable text) | Full page body |

## Homepage Sections

### 1. Hero

- Full-width section, navy-to-blue gradient background
- Geometric triangle pattern recreated in CSS/SVG (not a raster image)
- Large h1 heading, body paragraph, CTA button linking to contact form
- Framer Motion fade-up animation on load with staggered children (0.3s delay)

### 2. Services

- Section heading from Sanity
- Responsive grid: 3 columns desktop, 2 tablet, 1 mobile
- Each card: image/icon, title, description, tagline
- Light gray background (`#F5F5F5`) to contrast with hero
- Framer Motion fade-up on scroll into viewport

### 3. Trusted Partner

- Full-width navy background section
- Centered heading and body text, white text
- Visual break between services and contact form
- Brand reinforcement

### 4. Contact Form (in footer)

- Fields: first name (required), last name, email (required), phone, message (required)
- Client-side validation with React state
- Server-side validation in API route
- Submit via POST to `/api/contact`
- Resend delivers email with reply-to set to submitter's address
- Toast notification for success/error, no page reload

## Contact Form Flow

1. User fills form, client-side validation checks required fields and email format
2. POST to `/api/contact` with JSON body
3. API route validates server-side + rate limiting (in-memory throttle)
4. Resend sends email:
   - **To:** `siteSettings.contactEmail` from Sanity (fallback to env var)
   - **Subject:** "New Contact Form Submission — Trust Point IT Solutions"
   - **Body:** Clean HTML template with name, email, phone, message, timestamp
   - **Reply-To:** submitter's email
5. Returns JSON success/error
6. Frontend shows toast notification

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary (navy) | `#1B1464` | Headers, navbar, dark sections |
| Accent (blue) | `#2D7DD2` | CTAs, links, geometric pattern |
| Light accent | `#4DACF7` | Hover states, geometric pattern highlights |
| Background light | `#F5F5F5` | Services section, card backgrounds |
| Text primary | `#1B1464` | Body text on light backgrounds |
| Text light | `#FFFFFF` | Text on dark backgrounds |
| Font | Inter (Google Fonts) | Clean sans-serif, good readability |

## Animations (Framer Motion)

- **Hero content:** fade-up on load, 0.3s stagger between children
- **Service cards:** fade-up on scroll into viewport
- **Navbar:** background opacity transition from transparent to solid on scroll
- **Contact form:** success state transition
- **Principle:** subtle and professional — nothing aggressive or distracting

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, stacked sections, hamburger nav if needed |
| Tablet | 768–1024px | 2-column service grid |
| Desktop | > 1024px | 3-column service grid, full layout |

## Deployment & Infrastructure

- **Auto-deploy:** git push to `main` triggers Vercel deploy
- **Preview deploys:** PRs get preview URLs for staging/review
- **Environment variables** (Vercel dashboard):
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `SANITY_API_TOKEN`
  - `RESEND_API_KEY`
- **Domain:** `trustpointitsolutions.com` pointed to Vercel via DNS
- **Revalidation:** Sanity webhook triggers on-demand ISR revalidation on content changes

## SEO & Metadata

- Next.js `metadata` API for title, description, Open Graph, Twitter cards per page
- JSON-LD structured data for `LocalBusiness` schema
- Auto-generated `sitemap.xml` and `robots.txt`
- Semantic HTML with proper heading hierarchy and landmarks
- Lighthouse target: 90+ on all four categories (Performance, Accessibility, Best Practices, SEO)

## Accessibility

- Semantic HTML throughout (proper heading levels, nav/main/footer landmarks)
- WCAG AA color contrast on all text
- Keyboard navigation and visible focus indicators
- Skip-to-content link
- Alt text on all images (managed via Sanity image fields)
- ARIA attributes where semantic HTML is insufficient

## Future Expansion Paths

The architecture supports adding these without refactoring:

- **Blog:** Add `/blog` route + `post` Sanity schema, fetch with GROQ
- **Individual service pages:** Add `/services/[slug]` dynamic route
- **Client portal:** Add auth layer (NextAuth.js or Clerk) + protected routes
- **Booking/scheduling:** Embed Calendly or build custom with additional API routes
- **Additional static pages:** Create new `page` documents in Sanity, auto-routed via `[slug]`

## Current Services (to seed in Sanity)

1. **Proactive IT Management** — 24/7 monitoring, fewer disruptions, more uptime
2. **Reliable Helpdesk Support** — Fast resolution, clear communication
3. **Cybersecurity Protection** — Layered security, endpoint protection, backups
4. **Cloud & Microsoft 365 Support** — Email, collaboration, cloud infrastructure
5. **Backup & Disaster Recovery** — Data backup, business continuity
