import { AnimatedNumber } from "@/components/animated-number";
import type { CaseStudy } from "@/types";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="flex flex-col border border-foreground/10 bg-card p-8">
      <p className="eyebrow">{study.area}</p>
      <AnimatedNumber value={study.metric} className="mt-6 block font-serif text-3xl text-foreground" />
      <p className="mt-1 text-xs text-muted-foreground">{study.metricLabel}</p>
      <h3 className="mt-7 text-lg leading-snug text-foreground">{study.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
      <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-foreground/10 pt-5 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Duration</dt>
          <dd className="mt-1 text-foreground">{study.duration}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Result</dt>
          <dd className="mt-1 text-foreground">{study.result}</dd>
        </div>
      </dl>
    </article>
  );
}
