"use client";

import { useId, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultationForm({
  submitLabel = "Request consultation",
  attorneySlug,
}: {
  submitLabel?: string;
  attorneySlug?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const idPrefix = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          company: data.get("company"), // honeypot
          attorneySlug,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-cream/15 p-8">
        <p className="font-serif text-xl text-cream">Request received.</p>
        <p className="mt-3 text-sm leading-relaxed text-cream/70">
          Thank you — a member of the team will follow up within one business day to schedule your
          consultation.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6 border border-cream/15 p-8" onSubmit={handleSubmit} noValidate>
      {/* Honeypot field: hidden from real visitors via CSS, so only bots fill it in. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${idPrefix}-company`}>Company</label>
        <input
          id={`${idPrefix}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-name`} className="text-xs text-cream/60">
            Full name
          </Label>
          <Input
            id={`${idPrefix}-name`}
            name="name"
            required
            className="rounded-none border-cream/20 bg-transparent text-cream placeholder:text-cream/30"
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-phone`} className="text-xs text-cream/60">
            Phone
          </Label>
          <Input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            className="rounded-none border-cream/20 bg-transparent text-cream placeholder:text-cream/30"
            placeholder="(212) 555-0100"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-email`} className="text-xs text-cream/60">
          Email
        </Label>
        <Input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          required
          className="rounded-none border-cream/20 bg-transparent text-cream placeholder:text-cream/30"
          placeholder="jane@company.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-message`} className="text-xs text-cream/60">
          How can we help?
        </Label>
        <Textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={5}
          className="rounded-none border-cream/20 bg-transparent text-cream placeholder:text-cream/30"
          placeholder="A short summary of your matter."
        />
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        variant="creamOutline"
        size="xl"
        className="w-full rounded-none"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
