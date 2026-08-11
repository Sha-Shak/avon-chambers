import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Accepts consultation requests from ConsultationForm.
 *
 * This currently validates the submission and logs it server-side so
 * nothing is silently lost (the original form called
 * `e.preventDefault()` and did nothing further — submissions went
 * nowhere). Before launch, replace the `// TODO` below with a real
 * provider call: Resend, Postmark, SES or SMTP via nodemailer all work
 * from a Next.js route handler. Keep the zod validation either way — it's
 * what stops the honeypot/spam and malformed payloads from reaching
 * whatever you wire up.
 */
const consultationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  attorneySlug: z.string().trim().max(100).optional(),
  // Honeypot: real visitors never populate this hidden field.
  company: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { name, email, phone, message, attorneySlug } = parsed.data;

  // TODO: send this to a real destination before launch, e.g.:
  //   await resend.emails.send({ from, to: siteConfig.email, subject: `New consultation request from ${name}`, ... })
  console.info("[consultation-request]", {
    name,
    email,
    phone: phone || undefined,
    message: message || undefined,
    attorneySlug: attorneySlug || undefined,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
