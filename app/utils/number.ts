export function sanitizeNumberInput(value: string) : string {
  return value
    .replace(/[^\d.]/g, "") // remove non-numeric
    .replace(/^(\d*\.\d*)\./, "$1"); // only one dot
}
