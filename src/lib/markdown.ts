import readingTime from "reading-time";
import { generateSlug } from "./slug";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Calculates estimated reading time in integer minutes.
 */
export function calculateReadingTime(text: string): number {
  if (!text) return 1;
  const rt = readingTime(text);
  return Math.max(1, Math.ceil(rt.minutes));
}

/**
 * Extracts a clean excerpt from markdown text without markdown syntax.
 */
export function extractExcerpt(markdown: string, maxLength: number = 160): string {
  if (!markdown) return "";
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, "") // remove code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links
    .replace(/^#+\s+(.*)$/gm, "") // headers
    .replace(/>\s+(.*)$/gm, "$1") // blockquotes
    .replace(/[*_~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + "…";
}

/**
 * Extracts h2 and h3 headings from raw markdown for the Table of Contents.
 */
export function extractTableOfContents(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();

    // Remove inline links and formatting
    const cleanText = rawText
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();

    const id = generateSlug(cleanText);

    if (cleanText) {
      items.push({
        id,
        text: cleanText,
        level,
      });
    }
  }

  return items;
}
