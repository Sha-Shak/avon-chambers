import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const bn = items.some((item) => item.path.startsWith("/bn/"));
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label={bn ? "পৃষ্ঠার অবস্থান" : "Breadcrumb"} lang={bn ? "bn" : "en"} className="border-b border-foreground/10">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-6 py-3 text-xs leading-relaxed text-muted-foreground lg:px-10">
          {items.map((item, index) => <li key={item.path} className="flex min-w-0 items-center gap-2">
            {index > 0 && <ChevronRight aria-hidden="true" className="size-3 shrink-0" />}
            {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path} className="underline-offset-4 hover:underline">{item.name}</Link>}
          </li>)}
        </ol>
      </nav>
    </>
  );
}
