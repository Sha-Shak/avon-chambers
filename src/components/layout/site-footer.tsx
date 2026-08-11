import Link from "next/link";
import { Mail, X } from "lucide-react";
import { navLinks } from "@/config/nav-links";
import { siteConfig } from "@/config/site.config";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

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
            A boutique practice advising companies, founders and families on matters where the
            outcome matters more than the hours.
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
          <div className="mt-6 flex gap-4">
            <a href="#" aria-label="LinkedIn" className="text-cream/60 hover:text-cream">
              <LinkedInIcon className="size-4" />
            </a>
            <a href="#" aria-label="X (formerly Twitter)" className="text-cream/60 hover:text-cream">
              <X className="size-4" />
            </a>
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
