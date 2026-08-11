/**
 * Renders a single JSON-LD structured data block. The `<` escape prevents a
 * literal "</script>" inside a data value from prematurely closing the tag -
 * this is the standard safe pattern for injecting JSON into a script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
