/**
 * Converts a string into a clean, URL-friendly slug.
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // replace spaces and underscores with -
    .replace(/[^a-z0-9-]/g, "") // remove non-alphanumeric chars
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens
}
