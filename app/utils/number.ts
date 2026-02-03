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

export const formatCurrency = (amount: number | string): string => {
  if (amount === undefined || amount === null || amount === "") return "₹0.00";

  let num: number;
  if (typeof amount === 'string') {
    // Remove currency symbols, commas, and other non-numeric chars except dot
    num = parseFloat(amount.replace(/[^\d.-]/g, ''));
  } else {
    num = amount;
  }

  if (isNaN(num)) return "₹0.00";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};
