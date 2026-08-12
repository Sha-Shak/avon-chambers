"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { navLinks } from "@/config/nav-links";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-foreground/10 bg-background/95 backdrop-blur"
          : "border-transparent bg-transparent",
      )}
    >
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
          <span className="truncate font-serif text-xl tracking-tight text-foreground sm:text-2xl">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <nav className="hidden items-center gap-6 xl:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-[0.8125rem] tracking-wide transition-colors",
                  isActive(l.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild variant="navy" size="default" className="ml-1 rounded-none">
              <Link href="/contact">Book a Consultation</Link>
            </Button>
          </nav>

          <ThemeToggle />

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 text-foreground xl:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-foreground/10 bg-background xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-foreground/5 py-3 text-sm text-foreground last:border-0"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`tel:${siteConfig.consultationPhoneE164}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Phone className="size-4" /> {siteConfig.consultationPhoneDisplay}
            </a>
            <div className="mt-4 flex items-center gap-2 border-t border-foreground/5 pt-4 text-sm text-muted-foreground">
              <ThemeToggle /> Appearance
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
