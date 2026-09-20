import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlForImage } from "@/sanity/image";

type BodyImage = { asset?: { _ref: string }; alt?: string; caption?: string };

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: BodyImage }) => {
      if (!value?.asset) return null;
      return (
        <figure className="not-prose my-10">
          <div className="relative overflow-hidden bg-secondary">
            <Image
              src={urlForImage(value).width(1400).url()}
              alt={value.alt ?? ""}
              width={1400}
              height={933}
              sizes="(min-width: 768px) 48rem, 100vw"
              className="h-auto w-full object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 text-center text-xs text-muted-foreground">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

/** Rich-text body for Sanity posts — text plus any pictures the editor dropped in between. */
export function PostBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="prose-insight prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
