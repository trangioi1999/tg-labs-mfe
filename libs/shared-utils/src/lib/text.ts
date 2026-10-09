/**
 * Converts arbitrary text into a URL-friendly slug.
 * Diacritics are stripped (e.g. "Tiếng Việt" -> "tieng-viet").
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Truncates text on a word boundary and appends an ellipsis when needed. */
export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }
  const cut = input.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Estimates reading time in whole minutes (minimum 1). */
export function readingMinutes(text: string, wordsPerMinute = 220): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

/**
 * Case- and diacritic-insensitive "contains" check, used by simple
 * client-side search boxes.
 */
export function matchesQuery(haystack: string, query: string): boolean {
  const normalise = (value: string) =>
    value
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  const needle = normalise(query.trim());
  return needle.length === 0 || normalise(haystack).includes(needle);
}
