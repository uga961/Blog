export function generateSlug(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents and diacritics
    .toLowerCase()
    .trim()
    .replace(/&/g, " ") // treat & as whitespace
    .replace(/[\s_]+/g, "-") // collapse whitespace, spaces and underscores
    .replace(/[^\w\-]+/g, "") // remove punctuation and special characters
    .replace(/\-\-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens
}
