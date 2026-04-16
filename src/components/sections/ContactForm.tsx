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
