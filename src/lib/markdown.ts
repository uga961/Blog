import readingTime from "reading-time";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Calculates estimated reading time in minutes (minimum 1 minute).
 */
export function calculateReadingTime(content: string): number {
  const stats = readingTime(content || "");
  return Math.max(1, Math.ceil(stats.minutes));
}

/**
 * Extracts a concise excerpt from markdown content if none is provided.
 */
export function extractExcerpt(content: string, maxLength: number = 180): string {
  if (!content) return "";

  // Strip headers, images, links, code blocks
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") // remove code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // link text only
    .replace(/^#+\s+(.*)$/gm, "") // headings
    .replace(/>\s+(.*)$/gm, "$1") // blockquotes
    .replace(/[*_~]+/g, "") // emphasis markers
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength).trim() + "…";
}

/**
 * Extracts H2 and H3 headings for the Table of Contents.
 */
export function extractTableOfContents(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim().replace(/[*_`]/g, "");
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    toc.push({ id, text, level });
  }

  return toc;
}
