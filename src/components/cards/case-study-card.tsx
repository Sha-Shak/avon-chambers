import type { CaseStudy } from "@/types";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="flex flex-col border border-navy/10 bg-card p-8">
      <p className="eyebrow">{study.area}</p>
      <p className="mt-6 font-serif text-3xl text-navy">{study.metric}</p>
      <p className="mt-1 text-xs text-slate">{study.metricLabel}</p>
      <h3 className="mt-7 text-lg leading-snug text-navy">{study.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{study.summary}</p>
      <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-navy/10 pt-5 text-sm">
        <div>
          <dt className="text-xs text-slate">Duration</dt>
          <dd className="mt-1 text-navy">{study.duration}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate">Result</dt>
          <dd className="mt-1 text-navy">{study.result}</dd>
        </div>
      </dl>
    </article>
  );
}
