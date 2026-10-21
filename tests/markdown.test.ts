import { describe, it, expect } from "vitest";
import {
  calculateReadingTime,
  extractExcerpt,
  extractTableOfContents,
} from "@/lib/markdown";

describe("Markdown Utilities", () => {
  it("calculates minimum 1 minute reading time for short text", () => {
    const text = "Short article with only a few words.";
    expect(calculateReadingTime(text)).toBe(1);
  });

  it("calculates accurate reading time for long text (~200 words/min)", () => {
    // Generate ~450 words
    const words = Array(450).fill("word").join(" ");
    const minutes = calculateReadingTime(words);
    expect(minutes).toBeGreaterThanOrEqual(2);
  });

  it("extracts clean excerpt without markdown artifacts", () => {
    const markdown = `# Main Title
    
This is the **first paragraph** with a [link](https://example.com) and \`inline code\`.

![Image](https://example.com/img.png)

> A blockquote here.`;

    const excerpt = extractExcerpt(markdown, 100);
    expect(excerpt).not.toContain("#");
    expect(excerpt).not.toContain("**");
    expect(excerpt).not.toContain("![Image]");
    expect(excerpt).toContain("This is the first paragraph with a link and inline code");
  });

  it("extracts Table of Contents from H2 and H3 headings", () => {
    const markdown = `
# Title (Ignored)

## First Section
Content here.

### Nested Subsection
More content.

## Second Section
Final content.
`;

    const toc = extractTableOfContents(markdown);
    expect(toc).toHaveLength(3);
    expect(toc[0]).toEqual({
      id: "first-section",
      text: "First Section",
      level: 2,
    });
    expect(toc[1]).toEqual({
      id: "nested-subsection",
      text: "Nested Subsection",
      level: 3,
    });
    expect(toc[2]).toEqual({
      id: "second-section",
      text: "Second Section",
      level: 2,
    });
  });
});
