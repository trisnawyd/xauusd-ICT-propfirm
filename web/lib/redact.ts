// Centralized redaction so account financials never leak to the public site.
// NOTE: this only protects the *rendered* site — raw markdown still lives in
// git history on a public repo. For true privacy use a private repo.

const MASK = "••••";

// Account-size dollar figures: anything with thousands separators ($5,011.93)
// or 4+ leading digits ($4944.03). Small P&L values like $46.10 are analysis
// context and are intentionally kept.
const BIG_DOLLAR = /\$\s?(?:\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d{4,}(?:\.\d+)?)/g;

// MT5 ticket numbers — standalone 6–10 digit runs. Must NOT eat YYYYMMDD dates
// (8 digits starting with "20"), which appear in slugs, paths, and frontmatter.
const TICKET = /\b\d{6,10}\b/g;
const DATE_LIKE = /^20\d{6}$/; // 20060101 .. 20991231 range

function maskTicket(match: string): string {
  return DATE_LIKE.test(match) ? match : MASK;
}

export function redact(text: string): string {
  if (!text) return text;
  return text.replace(BIG_DOLLAR, MASK).replace(TICKET, maskTicket);
}

/** Redact a scalar field value pulled from frontmatter for display. */
export function redactValue(value: unknown): string {
  return redact(String(value ?? ""));
}
