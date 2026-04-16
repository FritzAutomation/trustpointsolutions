import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
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

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "First name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

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
