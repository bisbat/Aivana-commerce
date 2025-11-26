/**
 * Format price string or number to Thai Baht format with comma separators
 * @param price - Price as string or number
 * @returns Formatted price string (e.g., "1,500")
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return "0";
  }

  return numPrice.toLocaleString("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format price with currency symbol
 * @param price - Price as string or number
 * @returns Formatted price with ฿ symbol (e.g., "1,500฿")
 */
export function formatPriceWithCurrency(price: string | number): string {
  return `${formatPrice(price)}฿`;
}
