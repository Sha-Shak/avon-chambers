import Link from "next/link";
import { Mail } from "lucide-react";
import { SocialLinks } from "@/components/social-links";
import { navLinks } from "@/config/nav-links";
import { siteConfig } from "@/config/site.config";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Engagement", href: "/terms-of-engagement" },
  { label: "Attorney Advertising", href: "/attorney-advertising" },
  { label: "Accessibility", href: "/accessibility" },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div className="max-w-sm">
          <p className="font-serif text-2xl">{siteConfig.name}</p>
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            A Bangladesh-based set of law chambers providing professional legal advice and representation
            to corporate and private clients.
          </p>
          <p className="mt-6 text-sm text-cream/60">
            {siteConfig.address.streetAddress}
            <br />
            {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}{" "}
            {siteConfig.address.postalCode}
          </p>
        </div>

        <div>
          <p className="text-[0.6875rem] tracking-[0.2em] text-cream/40 uppercase">Quick links</p>
          <ul className="mt-5 space-y-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-cream/70 transition-colors hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.6875rem] tracking-[0.2em] text-cream/40 uppercase">Contact</p>
          <ul className="mt-5 space-y-3 text-sm text-cream/70">
            <li>
              <a href={`tel:${siteConfig.consultationPhoneE164}`} className="hover:text-cream">
                {siteConfig.consultationPhoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-cream">
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.officeHours}</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-4">
            <SocialLinks variant="dark" />
            <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="text-cream/60 hover:text-cream">
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-[0.6875rem] tracking-[0.2em] text-cream/40 uppercase">Legal</p>
          <ul className="mt-5 space-y-3 text-sm text-cream/70">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-cream/40 sm:flex-row sm:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
          <p>Prior results do not guarantee a similar outcome.</p>
        </div>
      </div>
    </footer>
  );
}
