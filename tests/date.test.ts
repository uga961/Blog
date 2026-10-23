import { describe, it, expect } from "vitest";
import { formatDisplayDate } from "@/lib/date";

describe("formatDisplayDate", () => {
  it("formats YYYY-MM-DD correctly in short format", () => {
    expect(formatDisplayDate("2026-10-23", "short")).toBe("Oct 23, 2026");
  });

  it("formats YYYY-MM-DD correctly in long format", () => {
    expect(formatDisplayDate("2026-10-23", "long")).toBe("October 23, 2026");
  });

  it("handles null, undefined, or empty date gracefully", () => {
    expect(formatDisplayDate(null)).toBe("Recent");
    expect(formatDisplayDate(undefined)).toBe("Recent");
    expect(formatDisplayDate("")).toBe("Recent");
  });

  it("handles full ISO date strings", () => {
    const formatted = formatDisplayDate("2026-10-23T00:00:00.000Z", "short");
    expect(formatted).toBe("Oct 23, 2026");
  });
});
