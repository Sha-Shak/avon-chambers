import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ConsultationForm } from "@/components/consultation-form";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION = `Speak with a partner at ${siteConfig.name} in lower Manhattan. Call ${siteConfig.consultationPhoneDisplay} or request a 45-minute confidential consultation.`;

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: { title: `Contact ${siteConfig.name}`, description: DESCRIPTION, url: "/contact" },
};

export default function ContactPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <section className="border-b border-navy/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">Speak with counsel</p>
            <h1 className="mt-4 text-4xl text-navy sm:text-5xl">Contact</h1>
            <p className="mt-6 text-base leading-relaxed text-slate">
              Every enquiry is read by a partner, not routed through an intake queue. Call, email, or use the
              form below to request a confidential consultation.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.45fr_0.55fr]">
          <FadeIn className="space-y-10">
            <div className="flex gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-slate" strokeWidth={1.5} />
              <div>
                <p className="eyebrow">Direct line</p>
                <a
                  href={`tel:${siteConfig.consultationPhoneE164}`}
                  className="mt-2 block text-lg text-navy hover:underline"
                >
                  {siteConfig.consultationPhoneDisplay}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="mt-0.5 size-5 shrink-0 text-slate" strokeWidth={1.5} />
              <div>
                <p className="eyebrow">Email</p>
                <a href={`mailto:${siteConfig.email}`} className="mt-2 block text-lg text-navy hover:underline">
                  {siteConfig.email}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-slate" strokeWidth={1.5} />
              <div>
                <p className="eyebrow">Office</p>
                <p className="mt-2 text-base leading-relaxed text-navy">
                  {siteConfig.address.streetAddress}
                  <br />
                  {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}{" "}
                  {siteConfig.address.postalCode}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-slate" strokeWidth={1.5} />
              <div>
                <p className="eyebrow">Hours</p>
                <p className="mt-2 text-base leading-relaxed text-navy">{siteConfig.officeHours}</p>
              </div>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-slate">
              Everything you send is treated as privileged and confidential, whether or not we go on to
              represent you.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="bg-navy p-1">
              <div className="bg-navy p-7 text-cream">
                <ConsultationForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
