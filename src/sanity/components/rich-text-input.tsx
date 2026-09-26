"use client";

import type { CSSProperties } from "react";
import { htmlToPortableText, type DeserializerRule } from "@portabletext/html";
import { compileSchema } from "@portabletext/schema";
import {
  PortableTextInput,
  type BlockStyleProps,
  type InputProps,
  type PortableTextInputProps,
} from "sanity";

const INDENT_STEP_PT = 36;
const MAX_INDENT_LEVEL = 3;

const pasteSchema = compileSchema({
  styles: [
    { name: "normal" },
    { name: "h2" },
    { name: "h3" },
    { name: "h4" },
    { name: "blockquote" },
    { name: "indent1" },
    { name: "indent2" },
    { name: "indent3" },
  ],
  lists: [{ name: "bullet" }, { name: "number" }],
  decorators: [
    { name: "strong" },
    { name: "em" },
    { name: "underline" },
    { name: "strike-through" },
    { name: "code" },
  ],
  annotations: [
    {
      name: "link",
      fields: [
        { name: "href", type: "string" },
        { name: "openInNewTab", type: "boolean" },
      ],
    },
  ],
});

function toPoints(value: number, unit: string) {
  switch (unit.toLowerCase()) {
    case "px":
      return value * 0.75;
    case "in":
      return value * 72;
    case "cm":
      return value * 28.3465;
    case "mm":
      return value * 2.83465;
    case "em":
    case "rem":
      return value * 12;
    default:
      return value;
  }
}

function getIndentLevel(element: Element) {
  const style = element.getAttribute("style") ?? "";
  const values = [...style.matchAll(/(?:margin-left|text-indent)\s*:\s*(-?[\d.]+)\s*(px|pt|in|cm|mm|em|rem)?/gi)]
    .map((match) => toPoints(Number(match[1]), match[2] ?? "pt"))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (values.length === 0) return 0;

  return Math.min(
    MAX_INDENT_LEVEL,
    Math.max(1, Math.round(Math.max(...values) / INDENT_STEP_PT)),
  );
}

function isListContent(element: Element) {
  const style = element.getAttribute("style") ?? "";
  const className = element.getAttribute("class") ?? "";

  return (
    element.closest("li") !== null ||
    /mso-list\s*:/i.test(style) ||
    /\bMsoListParagraph/i.test(className)
  );
}

const indentationRule: DeserializerRule = {
  deserialize(node, next, createBlock) {
    if (node.nodeType !== Node.ELEMENT_NODE) return undefined;

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();
    if ((tagName !== "p" && tagName !== "div") || isListContent(element)) {
      return undefined;
    }

    const level = getIndentLevel(element);
    if (level === 0) return undefined;

    return createBlock({
      _type: "block",
      style: `indent${level}`,
      children: next(element.childNodes),
    });
  },
};

function hasDocumentIndentation(html: string) {
  return /(?:margin-left|text-indent)\s*:\s*(?!0(?:\D|$))-?[\d.]+\s*(?:px|pt|in|cm|mm|em|rem)?/i.test(
    html,
  );
}

export function convertIndentedHtml(html: string) {
  return htmlToPortableText(html, {
    schema: pasteSchema,
    rules: [indentationRule],
    whitespaceMode: "preserve",
  });
}

function plainTextIndentLevel(line: string) {
  const leading = line.match(/^[\t ]+/)?.[0];
  if (!leading) return 0;

  const tabs = (leading.match(/\t/g) ?? []).length;
  const spaces = (leading.match(/ /g) ?? []).length;
  return Math.min(MAX_INDENT_LEVEL, tabs + Math.floor(spaces / 4));
}

function indentedPlainTextBlocks(text: string) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  if (!lines.some((line) => plainTextIndentLevel(line) > 0)) return undefined;

  return lines.map((line) => {
    const level = plainTextIndentLevel(line);
    return {
      _type: "block",
      style: level > 0 ? `indent${level}` : "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: level > 0 ? line.trimStart() : line,
        },
      ],
    };
  });
}

const onPaste: PortableTextInputProps["onPaste"] = (data) => {
  const html = data.event.clipboardData.getData("text/html");

  if (html && hasDocumentIndentation(html)) {
    return Promise.resolve({
      insert: convertIndentedHtml(html),
    });
  }

  const text = data.event.clipboardData.getData("text/plain");
  const insert = indentedPlainTextBlocks(text);
  return insert ? Promise.resolve({ insert }) : undefined;
};

export function RichTextInput(props: InputProps) {
  return <PortableTextInput {...(props as PortableTextInputProps)} onPaste={onPaste} />;
}

function IndentedBlock({ children, level }: BlockStyleProps & { level: number }) {
  const style = { paddingInlineStart: `${level * 2}rem` } satisfies CSSProperties;
  return <div style={style}>{children}</div>;
}

export function IndentOne(props: BlockStyleProps) {
  return <IndentedBlock {...props} level={1} />;
}

export function IndentTwo(props: BlockStyleProps) {
  return <IndentedBlock {...props} level={2} />;
}

export function IndentThree(props: BlockStyleProps) {
  return <IndentedBlock {...props} level={3} />;
}
