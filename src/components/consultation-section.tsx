import { Lock, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { SocialLinks } from "@/components/social-links";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { siteConfig } from "@/config/site.config";

export function ConsultationSection({
  eyebrow = "Book a consultation",
  heading = "Tell us what happened. We'll tell you where you stand.",
  blurb = "Initial consultations are 45 minutes and held with the partner who would lead your matter.",
  contactPhone = siteConfig.consultationPhoneDisplay,
  contactEmail,
}: {
  eyebrow?: string;
  heading?: string;
  blurb?: string;
  contactPhone?: string;
  contactEmail?: string;
}) {
  const content = (
    <>
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">
        <FadeIn className="min-w-0">
          <p className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase">{eyebrow}</p>
          <h2 className="mt-5 text-3xl sm:text-4xl">{heading}</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/60">{blurb}</p>
          <dl className="mt-12 space-y-6 text-sm">
            <div className="flex gap-4">
              <Phone className="mt-0.5 size-4 shrink-0 text-cream/50" strokeWidth={1.5} />
              <div>
                <dt className="text-cream/50">Direct line</dt>
                <dd className="mt-1">
                  <a href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                    {contactPhone}
                  </a>
                </dd>
                {contactEmail && (
                  <dd className="mt-1">
                    <a href={`mailto:${contactEmail}`} className="hover:underline">
                      {contactEmail}
                    </a>
                  </dd>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="mt-0.5 size-4 shrink-0 text-cream/50" strokeWidth={1.5} />
              <div>
                <dt className="text-cream/50">Office</dt>
                <dd className="mt-1 leading-relaxed">
                  {siteConfig.address.streetAddress}
                  <br />
                  {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}{" "}
                  {siteConfig.address.postalCode}
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Lock className="mt-0.5 size-4 shrink-0 text-cream/50" strokeWidth={1.5} />
              <div>
                <dt className="text-cream/50">Confidentiality</dt>
                <dd className="mt-1 leading-relaxed text-cream/70">
                  Everything you send is treated as privileged and confidential, whether or not we go
                  on to represent you.
                </dd>
              </div>
            </div>
          </dl>
        </FadeIn>

        <FadeIn delay={100} className="frost flex min-w-0 flex-col justify-center gap-10 p-8 sm:p-10">
          <div>
            <p className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase">Get in touch</p>
            <p className="mt-4 text-base leading-relaxed text-cream/70">
              The fastest way to reach us — message the team directly on WhatsApp and we&rsquo;ll respond
              as soon as we can.
            </p>
          </div>
          <WhatsAppCta message={heading.replace(/\.$/, "")} />
          <div>
            <p className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase">Follow us</p>
            <SocialLinks variant="dark" size="lg" only={["linkedIn", "facebook", "instagram"]} className="mt-5" />
          </div>
        </FadeIn>
      </div>
    </>
  );

  return <section className="dark bg-navy text-foreground">{content}</section>;
}
