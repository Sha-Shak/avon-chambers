import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Lawyer } from "@/types";

export function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <Link href={`/lawyers/${lawyer.slug}`} className="group block">
      <div className="relative aspect-3/4 w-full overflow-hidden bg-secondary">
        <Image
          src={lawyer.photo}
          alt={`Portrait of ${lawyer.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
        />
      </div>
      <h3 className="mt-5 text-lg text-foreground">{lawyer.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{lawyer.title}</p>
      <p className="mt-3 text-xs tracking-[0.12em] text-foreground uppercase">{lawyer.area}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase">
        View profile
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
