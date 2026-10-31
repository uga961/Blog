import { format, parseISO, isValid } from "date-fns";

export function formatDisplayDate(
  dateInput: string | Date | null | undefined,
  style: "short" | "long" | "iso" = "long"
): string {
  if (!dateInput) return "Recent";

  let date: Date;

  if (typeof dateInput === "string") {
    date = parseISO(dateInput);
    if (!isValid(date)) {
      date = new Date(dateInput);
    }
  } else {
    date = dateInput;
  }

  if (!isValid(date)) {
    return "Recent";
  }

  switch (style) {
    case "short":
      return format(date, "MMM d, yyyy");
    case "iso":
      return format(date, "yyyy-MM-dd");
    case "long":
    default:
      return format(date, "MMMM d, yyyy");
  }
}
