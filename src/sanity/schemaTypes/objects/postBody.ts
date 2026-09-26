import { defineArrayMember, defineField } from "sanity";
import {
  IndentOne,
  IndentThree,
  IndentTwo,
  RichTextInput,
} from "../../components/rich-text-input";

/** Shared long-form text rules for every editor in Sanity Studio. */
export const richTextBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Heading", value: "h2" },
    { title: "Subheading", value: "h3" },
    { title: "Small heading", value: "h4" },
    { title: "Quote", value: "blockquote" },
    { title: "Indent — level 1", value: "indent1", component: IndentOne },
    { title: "Indent — level 2", value: "indent2", component: IndentTwo },
    { title: "Indent — level 3", value: "indent3", component: IndentThree },
  ],
  lists: [
    { title: "Bulleted list", value: "bullet" },
    { title: "Numbered list", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
      { title: "Underline", value: "underline" },
      { title: "Strike", value: "strike-through" },
      { title: "Code", value: "code" },
    ],
    annotations: [
      defineArrayMember({
        name: "link",
        title: "Link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            title: "URL",
            type: "url",
            validation: (rule) =>
              rule.required().uri({
                allowRelative: true,
                scheme: ["http", "https", "mailto", "tel"],
              }),
          }),
          defineField({
            name: "openInNewTab",
            title: "Open in a new tab",
            type: "boolean",
            initialValue: false,
          }),
        ],
      }),
    ],
  },
});

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
  description:
    "Paste from Google Docs or Microsoft Word to retain headings, lists, indentation, bold, italic, underline, strike-through, and links.",
  components: { input: RichTextInput },
  of: [
    richTextBlock,
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
