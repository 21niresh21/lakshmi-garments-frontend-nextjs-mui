export function sanitizeNumberInput(value: string): string {
  // Remove everything except digits and dot
  let sanitized = value.replace(/[^\d.]/g, "");

  // Keep only the first dot
  const parts = sanitized.split(".");
  if (parts.length > 1) {
    sanitized = parts[0] + "." + parts.slice(1).join(""); // merge extra dots into numbers
  }

  return sanitized;
}
