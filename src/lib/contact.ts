/** Normalize existing Bangladesh phone values for consistent tel links and schema. */
export function phoneE164(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (/^01\d{9}$/.test(digits)) return `+88${digits}`;
  if (/^8801\d{9}$/.test(digits)) return `+${digits}`;
  return value.startsWith("+") ? `+${digits}` : digits;
}

export function phoneDisplay(value: string): string {
  const normalized = phoneE164(value);
  return /^\+8801\d{9}$/.test(normalized)
    ? `${normalized.slice(0, 4)} ${normalized.slice(4, 8)}-${normalized.slice(8)}`
    : value;
}
