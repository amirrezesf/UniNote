/**
 * Format an ISO 8601 date string to Persian (Jalali) calendar in "YY-MM-DD" format
 * using Persian digits. E.g. for 1404/04/28 → "۰۴-۰۴-۲۸".
 *
 * Uses native Intl.DateTimeFormat with fa-IR locale + Persian calendar extension
 * (u-ca-persian) so no external library is needed.
 */
export function formatJalali(iso: string): string {
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date).replace(/\//g, '-');
  } catch {
    return iso;
  }
}

/**
 * Convenience — same as formatJalali but accepts an optional Date object directly.
 */
export function formatJalaliDate(date?: Date | null): string {
  if (!date) return '—';
  const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date).replace(/\//g, '-');
}
