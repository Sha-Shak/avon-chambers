import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { ConsultationForm } from "@/components/consultation-form";
import { SocialLinks } from "@/components/social-links";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { breadcrumbSchema } from "@/lib/schema";

const DESCRIPTION = `Contact ${siteConfig.name} in Dhanmondi, Dhaka for professional legal advice and representation.`;

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

      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow">Speak with counsel</p>
            <h1 className="mt-4 text-4xl text-foreground sm:text-5xl">Contact</h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Contact Avon Chambers by phone, email or the form below to discuss your legal matter.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        {/* min-w-0 on both columns: grid items default to min-width:auto, so any
            wide min-content child would otherwise stretch the column past the
            viewport and scroll the whole page sideways on mobile. */}
        <div className="grid gap-16 lg:grid-cols-[0.45fr_0.55fr]">
          <FadeIn className="min-w-0 space-y-10">
            <div className="flex gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="eyebrow">Direct line</p>
                <a
                  href={`tel:${siteConfig.consultationPhoneE164}`}
                  className="mt-2 block text-lg text-foreground hover:underline"
                >
                  {siteConfig.consultationPhoneDisplay}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="mt-0.5 size-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="eyebrow">Email</p>
                <a href={`mailto:${siteConfig.email}`} className="mt-2 block text-lg text-foreground hover:underline">
                  {siteConfig.email}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="eyebrow">Office</p>
                <p className="mt-2 text-base leading-relaxed text-foreground">
                  {siteConfig.address.streetAddress}
                  <br />
                  {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}{" "}
                  {siteConfig.address.postalCode}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="eyebrow">Hours</p>
                <p className="mt-2 text-base leading-relaxed text-foreground">{siteConfig.officeHours}</p>
              </div>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Everything you send is treated as privileged and confidential, whether or not we go on to
              represent you.
            </p>
            <div>
              <p className="eyebrow">Follow us</p>
              <SocialLinks variant="light" className="mt-4" />
            </div>
          </FadeIn>

          <FadeIn delay={100} className="min-w-0">
            <div className="bg-navy p-1">
              <div className="bg-navy p-4 text-cream sm:p-7">
                <ConsultationForm />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
