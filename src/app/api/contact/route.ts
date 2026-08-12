import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/config/site.config";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimitEntries = new Map<string, { count: number; resetAt: number }>();

/**
 * Accepts consultation requests from ConsultationForm.
 *
 * The email provider is configured with RESEND_API_KEY and
 * CONTACT_FROM_EMAIL. No submission is reported as successful unless the
 * provider accepts it for delivery.
 */
const consultationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Enter a valid email address").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  attorneySlug: z.string().trim().max(100).optional(),
  turnstileToken: z.string().max(2048).optional(),
  // Honeypot: real visitors never populate this hidden field.
  company: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-nf-client-connection-ip") ??
    forwardedFor?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Process-local protection against bursts. Turnstile protects across server instances. */
function consumeRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimitEntries.get(ip);

  if (!entry || entry.resetAt <= now) {
    rateLimitEntries.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  return {
    allowed: entry.count <= MAX_REQUESTS_PER_WINDOW,
    retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
  };
}

type TurnstileResponse = {
  success: boolean;
  action?: string;
  hostname?: string;
};

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!secret && !siteKey) return { valid: true };
  if (!secret || !siteKey || !token) return { valid: false };

  const formData = new FormData();
  formData.set("secret", secret);
  formData.set("response", token);
  if (ip !== "unknown") formData.set("remoteip", ip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData, signal: AbortSignal.timeout(5_000) },
    );
    const result = (await response.json()) as TurnstileResponse;
    const expectedHostname = new URL(siteConfig.url).hostname;

    return {
      valid:
        response.ok &&
        result.success &&
        result.action === "contact_form" &&
        result.hostname === expectedHostname,
    };
  } catch {
    return { valid: false };
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = consumeRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        issues: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  const { name, email, phone, message, attorneySlug, turnstileToken } =
    parsed.data;

  const turnstile = await verifyTurnstile(turnstileToken, ip);
  if (!turnstile.valid) {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;

  if (!apiKey || !from) {
    console.error("Contact form email delivery is not configured.");
    return NextResponse.json(
      {
        error:
          "We are unable to send your request right now. Please call or email us directly.",
      },
      { status: 503 },
    );
  }

  const details = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "Not provided"],
    ["Requested attorney", attorneySlug || "Not specified"],
    ["Message", message || "Not provided"],
  ];

  let delivery: Response;
  try {
    delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New consultation request from ${name}`,
        text: details
          .map(([label, value]) => `${label}: ${value}`)
          .join("\n\n"),
        html: details
          .map(
            ([label, value]) =>
              `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`,
          )
          .join(""),
      }),
    });
  } catch {
    console.error("Contact form email delivery could not be reached.");
    return NextResponse.json(
      {
        error:
          "We could not send your request. Please try again or contact us directly.",
      },
      { status: 502 },
    );
  }

  if (!delivery.ok) {
    console.error("Contact form email delivery failed.", {
      status: delivery.status,
    });
    return NextResponse.json(
      {
        error:
          "We could not send your request. Please try again or contact us directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
