"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ContactFormData } from "@/types";
import Button from "@/components/ui/Button";

const inputClass =
  "peer w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-transparent backdrop-blur-sm transition-colors duration-200 focus:border-cyan/60 focus:outline-none focus:ring-0";

const labelClass =
  "pointer-events-none absolute left-4 top-3 origin-left text-sm text-white/50 transition-all duration-200 peer-focus:-translate-y-5 peer-focus:scale-[0.85] peer-focus:text-cyan-light peer-[&:not(:placeholder-shown)]:-translate-y-5 peer-[&:not(:placeholder-shown)]:scale-[0.85] peer-[&:not(:placeholder-shown)]:text-white/70";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
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
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  return (
    <section
      id="contact"
      className="cursor-glow-target noise relative overflow-hidden bg-navy-950 py-28"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse, rgba(6, 182, 212, 0.3) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div className="absolute inset-0 bg-grid mask-radial-fade opacity-40" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Left: pitch */}
        <div>
          <div className="eyebrow mb-4 flex items-center gap-3 text-cyan-light">
            <span className="inline-block h-[1px] w-8 bg-cyan-light/60" />
            Get in touch
          </div>
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Let&apos;s talk about your IT.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
            Tell us a little about your business and what you need. We&apos;ll
            follow up within one business day.
          </p>

          {/* Small signal badges */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono-ui text-xs text-white/40">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              Response &lt; 1 business day
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              No-obligation consult
            </span>
          </div>
        </div>

        {/* Right: form */}
        <div className="relative">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-sm"
            >
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-cyan/30" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-cyan/20">
                    <svg className="h-6 w-6 text-cyan" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12l5 5 9-9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="font-display text-2xl font-semibold text-white">
                Message received.
              </p>
              <p className="mt-2 text-white/60">
                We&apos;ll get back to you within one business day.
              </p>
              <div className="mt-8 flex justify-center">
                <Button onClick={() => setStatus("idle")} variant="ghost">
                  Send another message
                </Button>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FloatingInput
                  label="First name *"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <FloatingInput
                  label="Last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <FloatingInput
                  label="Email *"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <FloatingInput
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-5 relative">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=" "
                  className={inputClass + " resize-none"}
                />
                <label htmlFor="message" className={labelClass}>
                  Message *
                </label>
              </div>

              {status === "error" && (
                <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
              )}

              <div className="mt-8 flex items-center justify-between gap-4">
                <p className="font-mono-ui text-xs text-white/30">
                  {status === "sending" ? "TRANSMITTING..." : "READY TO SEND"}
                </p>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send message →"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FloatingInput({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={inputClass}
      />
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
    </div>
  );
}
