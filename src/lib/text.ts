// Copy marks code terms with backticks. Plain-text outputs (meta tags, build checks) drop them.
export function stripBackticks(s: string): string {
  return s.replace(/`/g, "");
}
