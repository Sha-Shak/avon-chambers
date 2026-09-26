import type { ReactNode } from "react";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlForImage } from "@/sanity/image";

type BodyImage = { asset?: { _ref: string }; alt?: string; caption?: string };
type LinkMark = { href?: string; openInNewTab?: boolean };

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
  marks: {
    underline: ({ children }) => <u>{children}</u>,
    "strike-through": ({ children }) => <s>{children}</s>,
    link: ({ children, value }: { children?: ReactNode; value?: LinkMark }) => {
      if (!value?.href) return <>{children}</>;

      const external = /^https?:\/\//i.test(value.href);
      const newTab = value.openInNewTab || external;

      return (
        <a
          href={value.href}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
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
