/**
 * For ambassador accounts, /documents/mine ignores the session/semester params
 * and returns the ambassador's FULL upload list regardless of which semester
 * you asked for. Since we call this endpoint twice (once for "first", once
 * for "second") and concatenate the results, ambassador accounts end up with
 * every document counted twice.
 *
 * This dedupes by _id after concatenating, so the count is always accurate
 * whether the backend returned two distinct lists (regular students) or the
 * same list twice (ambassadors).
 */
export function dedupeDocuments<T extends { _id: string }>(docs: T[]): T[] {
  return Array.from(new Map(docs.map((doc) => [doc._id, doc])).values());
}