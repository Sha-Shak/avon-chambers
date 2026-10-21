import type { PortableTextBlock } from "@portabletext/types";
import { getAllLawyers } from "@/lib/data";

/** Link the first exact mention of a known lawyer, preserving existing rich-text links. */
export function prepareArticleBody(body: PortableTextBlock[]): PortableTextBlock[] {
  const lawyers = getAllLawyers().sort((a, b) => b.name.length - a.name.length);
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(lawyers.map((lawyer) => escape(lawyer.name)).join("|"), "g");
  const linked = new Set<string>();

  return body.map((block) => {
    if (block._type !== "block") return block;
    const markDefs = [...(block.markDefs ?? [])];
    const children = block.children.flatMap((child) => {
      if (child._type !== "span" || typeof child.text !== "string") return [child];
      const text = child.text.replaceAll("an continuing responsibility", "a continuing responsibility");
      if ((child.marks ?? []).some((key: string) => markDefs.some((mark) => mark._key === key && mark._type === "link"))) {
        return [{ ...child, text }];
      }
      const spans: typeof block.children = [];
      let cursor = 0;
      for (const match of text.matchAll(pattern)) {
        const lawyer = lawyers.find((candidate) => candidate.name === match[0]);
        if (!lawyer || linked.has(lawyer.slug)) continue;
        const start = match.index;
        if (start > cursor) spans.push({ ...child, _key: `${child._key}-text-${cursor}`, text: text.slice(cursor, start) });
        const key = `lawyer-${lawyer.slug}`;
        markDefs.push({ _key: key, _type: "link", href: `/lawyers/${lawyer.slug}` });
        spans.push({ ...child, _key: `${child._key}-${key}`, text: match[0], marks: [...(child.marks ?? []), key] });
        linked.add(lawyer.slug);
        cursor = start + match[0].length;
      }
      if (cursor < text.length || spans.length === 0) spans.push({ ...child, _key: `${child._key}-text-${cursor}`, text: text.slice(cursor) });
      return spans;
    });
    return { ...block, children, markDefs };
  });
}
