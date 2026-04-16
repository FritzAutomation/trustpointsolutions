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
  let page: Page | null = null;
  try {
    page = await client.fetch<Page | null>(pageBySlugQuery, { slug: "privacy-policy" });
  } catch {
    // Sanity not configured
  }

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
