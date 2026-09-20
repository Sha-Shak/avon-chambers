/**
 * Site navigation — edit the lists below to change the menu.
 *
 * - `primaryNavLinks` are always visible in the header.
 * - `navGroups` are dropdowns in the header (a label plus the links inside).
 *   Rename a group by changing its `label`, or move a link between groups.
 *
 * "Contact" lives in a dropdown because the "Book a Consultation" button
 * next to the menu already leads there.
 *
 * On mobile, and in the footer, everything is shown as one flat list
 * (`navLinks`, which is built from the lists above — don't edit it).
 */
export const primaryNavLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Practice Areas", href: "/practice-areas" },
  { label: "Lawyers", href: "/lawyers" },
  { label: "Life at Avon", href: "/life-at-avon" },
] as const;

export interface NavLinkItem {
  readonly label: string;
  readonly href: string;
}

export interface NavGroup {
  readonly label: string;
  readonly links: readonly NavLinkItem[];
}

export const navGroups: readonly NavGroup[] = [
  {
    label: "Newsroom",
    links: [
      { label: "News & Events", href: "/news-events" },
      { label: "Articles", href: "/insights" },
    ],
  },
  {
    label: "Connect",
    links: [
      { label: "Pro Bono", href: "/pro-bono" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const navLinks: readonly NavLinkItem[] = [...primaryNavLinks, ...navGroups.flatMap((g) => g.links)];
