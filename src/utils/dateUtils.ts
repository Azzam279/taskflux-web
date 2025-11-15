/**
 * Converts an ISO date string (e.g. "2025-11-20T00:00:00.000000Z")
 * to "YYYY-MM-DD" format for <input type="date">.
 */
export function isoToDateInput(iso: string | undefined | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}
