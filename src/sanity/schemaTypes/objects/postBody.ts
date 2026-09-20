import { defineArrayMember, defineField } from "sanity";

/**
 * Cover image field shared by the News & Events and Pro Bono documents —
 * alt text sits inside the image so screen readers and search get a proper
 * description whenever a picture is uploaded.
 */
export const coverImageField = defineField({
  name: "coverImage",
  title: "Cover image",
  type: "image",
  description: "The main picture, shown on the listing page and at the top of the post. Landscape images work best.",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Description of the picture",
      type: "string",
      description: "A short description for screen readers and search engines.",
    }),
  ],
});

/**
 * Rich-text body that also accepts pictures dropped in between paragraphs,
 * so an editor can tell a story with photos, not just text.
 */
export const postBodyField = defineField({
  name: "body",
  title: "Post",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Description of the picture", type: "string" }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
  ],
  validation: (rule) => rule.required(),
});
