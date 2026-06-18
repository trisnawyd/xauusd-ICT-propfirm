const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** YYYYMMDD -> "12 Jun 2026" (falls back to the raw string). */
export function formatDate(yyyymmdd: string): string {
  const m = yyyymmdd.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!m) return yyyymmdd;
  const [, y, mo, d] = m;
  const month = MONTHS[Number(mo) - 1] ?? mo;
  return `${Number(d)} ${month} ${y}`;
}

/** YYYYMMDD_HHMM_dir -> "14:24" (time portion), else "". */
export function timeFromSlug(slug: string): string {
  const m = slug.match(/^\d{8}_(\d{2})(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : "";
}
