"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Preserve Bangla for the translated directory without inventing translations elsewhere. */
export function PracticeDirectoryLink({ children, className }: { children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  return <Link href={pathname.startsWith("/bn/") ? "/bn/practice-areas" : "/practice-areas"} className={className}>{children}</Link>;
}
