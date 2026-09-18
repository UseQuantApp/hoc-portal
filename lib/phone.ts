/**
 * Normalizes a Nigerian phone number to E.164 format (+234XXXXXXXXXX).
 * The backend API requires E.164 format and will reject any other format.
 * 
 * @param raw - A Nigerian phone number in any common format
 * @returns The phone number in E.164 format, or the cleaned input if format is unrecognized
 */
export function normalizeNigerianPhone(raw: string): string {
  // Strip spaces, dashes, and parentheses
  const cleaned = raw.replace(/[\s\-()]/g, '');
  
  // Already in E.164 format: +234 followed by 10 digits
  if (/^\+234\d{10}$/.test(cleaned)) {
    return cleaned;
  }
  
  // 234 followed by 10 digits (missing the +)
  if (/^234\d{10}$/.test(cleaned)) {
    return '+' + cleaned;
  }
  
  // Leading 0 followed by 10 digits (local Nigerian format: 0XXXXXXXXXX)
  if (/^0\d{10}$/.test(cleaned)) {
    return '+234' + cleaned.slice(1);
  }
  
  // Bare 10 digits with no leading 0 (8012345678)
  if (/^\d{10}$/.test(cleaned)) {
    return '+234' + cleaned;
  }
  
  // Unrecognized format - return cleaned string for backend validation
  return cleaned;
}
