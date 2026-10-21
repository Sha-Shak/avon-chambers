import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PracticeAreaIcon } from "@/lib/icons";
import type { PracticeArea } from "@/types";

export function PracticeAreaCard({ area, locale = "en" }: { area: PracticeArea; locale?: "en" | "bn" }) {
  return (
    <Link
      href={`${locale === "bn" ? "/bn" : ""}/practice-areas/${area.slug}`}
      className="frost group flex h-full w-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-secondary">
        <Image
          src={area.image.src}
          alt={area.image.alt}
          fill
          quality={60}
          fetchPriority="low"
          sizes="(min-width: 640px) 352px, 86vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-navy/80 backdrop-blur">
          <PracticeAreaIcon name={area.icon} className="size-5 text-cream" strokeWidth={1.25} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-xl text-foreground">{area.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{area.copy}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase">
          {locale === "bn" ? "বিস্তারিত জানুন" : "Learn more"}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
