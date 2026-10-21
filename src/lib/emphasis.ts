const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Turns CMS text into safe HTML where `*word*` becomes `<em>word</em>`.
 * Everything else is escaped, so this is the only markup Hazel can add.
 */
export function emphasis(text: string): string {
  const escaped = text.replace(/[&<>"']/g, (char) => ESCAPES[char]);
  return escaped.replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
