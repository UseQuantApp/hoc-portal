/**
 * Computes the current academic session in "YYYY/YYYY+1" format (e.g. "2026/2027"),
 * since nothing in the backend currently exposes a "current session" value directly —
 * every place that needed a session string had it hardcoded to "2024/2025".
 *
 * Heuristic: Nigerian university sessions typically run roughly September–July.
 * So September–December counts as the START of a new session (year/year+1),
 * and January–August counts as the TAIL END of the session that started the
 * previous September (year-1/year).
 *
 * NOTE: this is a guess, not authoritative. If the backend ever adds a real
 * "current session" field (on GET /students/me, or a dedicated endpoint),
 * switch to reading that instead of computing it here.
 */
export function getCurrentAcademicSession(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = January, 8 = September

  const startYear = month >= 8 ? year : year - 1;
  return `${startYear}/${startYear + 1}`;
}