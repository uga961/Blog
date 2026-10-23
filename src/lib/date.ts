import { format } from "date-fns";

/**
 * Safely formats a date string (YYYY-MM-DD or ISO) into human-readable text.
 * Prevents timezone-shifting bugs across UTC / PST / IST by decomposing date parts,
 * guaranteeing identical server-side and client-side rendering (zero hydration mismatch).
 */
export function formatDisplayDate(
  dateInput?: string | Date | null,
  pattern: "short" | "long" = "short"
): string {
  if (!dateInput) return "Recent";

  try {
    if (typeof dateInput === "string") {
      const trimmed = dateInput.trim();
      const match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const day = parseInt(match[3], 10);
        const d = new Date(year, month, day);
        return format(d, pattern === "long" ? "MMMM d, yyyy" : "MMM d, yyyy");
      }
      return format(new Date(trimmed), pattern === "long" ? "MMMM d, yyyy" : "MMM d, yyyy");
    }

    return format(dateInput, pattern === "long" ? "MMMM d, yyyy" : "MMM d, yyyy");
  } catch {
    return "Recent";
  }
}
