import { describe, it, expect } from "vitest";
import { generateSlug } from "@/lib/slug";

describe("Slug Generator", () => {
  it("converts simple string to lowercase kebab-case", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("strips accents and diacritics", () => {
    expect(generateSlug("Café & Crème Brûlée")).toBe("cafe-creme-brulee");
  });

  it("removes punctuation and special characters", () => {
    expect(
      generateSlug("Building Resilient Systems: What, Why & How?!")
    ).toBe("building-resilient-systems-what-why-how");
  });

  it("collapses multiple spaces, dashes, and underscores", () => {
    expect(generateSlug("Multiple   Spaces___and---dashes")).toBe(
      "multiple-spaces-and-dashes"
    );
  });

  it("trims leading and trailing hyphens", () => {
    expect(generateSlug("---test-title---")).toBe("test-title");
  });

  it("handles empty or whitespace-only strings gracefully", () => {
    expect(generateSlug("   ")).toBe("");
  });
});
