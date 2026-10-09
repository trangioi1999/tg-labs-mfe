/**
 * Formats an ISO date (`YYYY-MM-DD`) for display. Dates are interpreted as UTC
 * calendar dates so the output does not shift with the viewer's timezone.
 */
export function formatDate(isoDate: string, locale = 'en-US'): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
