import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { JobPostMeta } from "@/types";

export function JobCard({ job }: { job: JobPostMeta }) {
  return (
    <article className="flex flex-col justify-between gap-6 border-t border-foreground/15 py-8 sm:flex-row sm:items-center">
      <div>
        <p className="eyebrow">{job.department}</p>
        <h3 className="mt-3 text-xl text-foreground">
          <Link href={`/careers/${job.slug}`} className="hover:underline">
            {job.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{job.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" strokeWidth={1.5} />
            {job.location}
          </span>
          <span>{job.type}</span>
        </div>
      </div>
      <Link
        href={`/careers/${job.slug}`}
        className="inline-flex shrink-0 items-center gap-2 text-[0.75rem] tracking-[0.14em] text-foreground uppercase"
      >
        View role <ArrowRight className="size-3.5" />
      </Link>
    </article>
  );
}
