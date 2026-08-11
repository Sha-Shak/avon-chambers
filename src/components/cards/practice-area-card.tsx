import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PracticeAreaIcon } from "@/lib/icons";
import type { PracticeArea } from "@/types";

export function PracticeAreaCard({ area }: { area: PracticeArea }) {
  return (
    <Link
      href={`/practice-areas/${area.slug}`}
      className="group flex w-full flex-col bg-card p-8 transition-colors hover:bg-secondary/70"
    >
      <PracticeAreaIcon
        name={area.icon}
        className="size-6 text-slate transition-colors group-hover:text-navy"
        strokeWidth={1.25}
      />
      <h3 className="mt-6 text-xl text-navy">{area.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{area.copy}</p>
      <span className="mt-7 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-navy uppercase">
        Learn more
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
