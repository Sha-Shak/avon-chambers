"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { navLinks } from "@/config/nav-links";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-5 lg:px-10">
        <Link href="/" className="flex min-w-0 items-baseline gap-2">
          <Image
            src={mediaConfig.brand.logo.src}
            alt={mediaConfig.brand.logo.alt}
            width={mediaConfig.brand.logo.width}
            height={mediaConfig.brand.logo.height}
            className="size-8 shrink-0 self-center sm:size-9"
            priority
          />
          <span className="truncate font-serif text-xl tracking-tight text-navy sm:text-2xl">
            {siteConfig.name}
          </span>
          <span className="hidden text-[0.625rem] tracking-[0.28em] text-slate uppercase sm:inline">
            Est. {siteConfig.foundingDate}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-[0.8125rem] tracking-wide transition-colors",
                isActive(l.href) ? "text-navy" : "text-slate hover:text-navy",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild variant="navy" size="default" className="ml-1 rounded-none">
            <Link href="/contact">Book a Consultation</Link>
          </Button>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 text-navy lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-navy/10 bg-cream lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-navy/5 py-3 text-sm text-navy last:border-0"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`tel:${siteConfig.consultationPhoneE164}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-slate"
            >
              <Phone className="size-4" /> {siteConfig.consultationPhoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
