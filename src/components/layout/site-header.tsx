"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site.config";
import { mediaConfig } from "@/config/media.config";
import { navGroups, primaryNavLinks, type NavGroup } from "@/config/nav-links";
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
          ? "border-foreground/10 bg-background/80 backdrop-blur-md"
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
          <nav className="hidden items-center gap-5 xl:flex 2xl:gap-6">
            {primaryNavLinks.map((l) => (
              <NavLink key={l.href} href={l.href} active={isActive(l.href)}>
                {l.label}
              </NavLink>
            ))}
            {navGroups.map((group) => (
              <NavDropdown key={group.label} group={group} isActive={isActive} />
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
        <div className="border-t border-foreground/10 bg-background/90 backdrop-blur-md xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {primaryNavLinks.map((l) => (
              <MobileLink key={l.href} href={l.href} onNavigate={() => setOpen(false)}>
                {l.label}
              </MobileLink>
            ))}
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col">
                <p className="pt-5 pb-1 text-[0.6875rem] tracking-[0.2em] text-muted-foreground uppercase">{group.label}</p>
                {group.links.map((l) => (
                  <MobileLink key={l.href} href={l.href} onNavigate={() => setOpen(false)}>
                    {l.label}
                  </MobileLink>
                ))}
              </div>
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

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-[0.8125rem] tracking-wide transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="border-b border-foreground/5 py-3 text-sm text-foreground last:border-0"
    >
      {children}
    </Link>
  );
}

/** A header dropdown (e.g. "Newsroom"): opens on hover or click, closes on Escape, outside click, or navigation. */
function NavDropdown({ group, isActive }: { group: NavGroup; isActive: (href: string) => boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<string>("");
  const hasActiveChild = group.links.some((l) => isActive(l.href));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        // A mouse click keeps the menu open (hover already opened it); touch and keyboard clicks toggle it.
        onClick={(e) => setOpen((v) => (e.detail > 0 && lastPointer.current === "mouse" ? true : !v))}
        onPointerDown={(e) => (lastPointer.current = e.pointerType)}
        className={cn(
          "inline-flex items-center gap-1 text-[0.8125rem] tracking-wide transition-colors",
          hasActiveChild || open ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {group.label}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* The pt-3 wrapper bridges the gap between button and panel so the hover doesn't drop while moving down. */}
      <div
        className={cn(
          "absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3 transition-all duration-200",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <ul
          role="menu"
          className="min-w-52 border border-foreground/10 bg-background/95 py-2 shadow-xl shadow-navy/10 backdrop-blur-md"
        >
          {group.links.map((l) => (
            <li key={l.href} role="none">
              <Link
                href={l.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-5 py-2.5 text-[0.8125rem] tracking-wide transition-colors hover:bg-secondary",
                  isActive(l.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
