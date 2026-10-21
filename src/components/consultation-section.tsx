import { phoneE164, phoneDisplay } from "@/lib/contact";
import { Lock, MapPin, Phone } from "lucide-react";
import { SectionBackdrop } from "@/components/section-backdrop";
import { FadeIn } from "@/components/fade-in";
import { SocialLinks } from "@/components/social-links";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { siteConfig } from "@/config/site.config";

/**
 * The closing "book a consultation" band. It's a plain navy band on inner
 * pages; pass `backdrop` (the home page does) to put the office photo behind
 * it, like the home page's other bands.
 */
export function ConsultationSection({
  backdrop = false,
  locale = "en",
  eyebrow = "Book a consultation",
  heading = "Tell us what happened. We'll tell you where you stand.",
  blurb = "Initial consultations are 45 minutes and held with the partner who would lead your matter.",
  contactPhone = siteConfig.consultationPhoneDisplay,
  contactEmail,
}: {
  locale?: "en" | "bn";
  eyebrow?: string;
  heading?: string;
  blurb?: string;
  contactPhone?: string;
  contactEmail?: string;
  backdrop?: boolean;
}) {
  const bn = locale === "bn";
  const content = (
    <>
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">
        <FadeIn className="min-w-0">
          <p className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase">{eyebrow}</p>
          <h2 className="mt-5 text-3xl sm:text-4xl">{heading}</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/60">{bn ? "প্রাথমিক পরামর্শের সময় ৪৫ মিনিট। আপনার বিষয়টির দায়িত্ব নেবেন এমন পার্টনারের সঙ্গে এই আলোচনা হয়।" : blurb}</p>
          <div className="mt-12 space-y-6 text-sm">
            <div className="flex gap-4">
              <Phone className="mt-0.5 size-4 shrink-0 text-cream/50" strokeWidth={1.5} />
              <dl>
                <dt className="text-cream/50">{bn ? "সরাসরি ফোন" : "Direct line"}</dt>
                <dd className="mt-1">
                  <a href={`tel:${phoneE164(contactPhone)}`} className="hover:underline">
                    {phoneDisplay(contactPhone)}
                  </a>
                </dd>
                {contactEmail && (
                  <dd className="mt-1">
                    <a href={`mailto:${contactEmail}`} className="hover:underline">
                      {contactEmail}
                    </a>
                  </dd>
                )}
              </dl>
            </div>
            <div className="flex gap-4">
              <MapPin className="mt-0.5 size-4 shrink-0 text-cream/50" strokeWidth={1.5} />
              <dl>
                <dt className="text-cream/50">{bn ? "কার্যালয়" : "Office"}</dt>
                <dd className="mt-1 leading-relaxed">
                  {bn ? "ফ্ল্যাট ৪এ, লেভেল ৩, কনক বিন্দু, হাউস ৩৯এ, রোড ৮" : siteConfig.address.streetAddress}
                  <br />
                  {bn ? "ধানমন্ডি, ঢাকা ১২০৫" : `${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion} ${siteConfig.address.postalCode}`}
                </dd>
              </dl>
            </div>
            <div className="flex gap-4">
              <Lock className="mt-0.5 size-4 shrink-0 text-cream/50" strokeWidth={1.5} />
              <dl>
                <dt className="text-cream/50">{bn ? "গোপনীয়তা" : "Confidentiality"}</dt>
                <dd className="mt-1 leading-relaxed text-cream/70">
                  {bn ? "আমরা পরবর্তী সময়ে আপনার প্রতিনিধিত্ব করি বা না করি, আপনার পাঠানো সব তথ্য পেশাগত গোপনীয়তার আওতায় বিবেচনা করা হয়।" : "Everything you send is treated as privileged and confidential, whether or not we go on to represent you."}
                </dd>
              </dl>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={100} className="frost flex min-w-0 flex-col justify-center gap-10 p-8 sm:p-10">
          <div>
            <p className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase">{bn ? "যোগাযোগ করুন" : "Get in touch"}</p>
            <p className="mt-4 text-base leading-relaxed text-cream/70">
              {bn ? "আমাদের দলকে হোয়াটসঅ্যাপে বার্তা দিন। আমরা যত দ্রুত সম্ভব উত্তর দেব।" : "Message our team on WhatsApp and we’ll respond as soon as we can."}
            </p>
          </div>
          <WhatsAppCta label={bn ? "হোয়াটসঅ্যাপে যোগাযোগ করুন" : undefined} message={heading.replace(/\.$/, "")} />
          <div>
            <p className="text-[0.6875rem] tracking-[0.2em] text-cream/50 uppercase">{bn ? "আমাদের অনুসরণ করুন" : "Follow us"}</p>
            <SocialLinks variant="dark" size="lg" only={["linkedIn", "facebook", "instagram"]} className="mt-5" />
          </div>
        </FadeIn>
      </div>
    </>
  );

  return backdrop ? (
    <SectionBackdrop image="consultation">{content}</SectionBackdrop>
  ) : (
    <section className="dark bg-navy text-foreground">{content}</section>
  );
}
