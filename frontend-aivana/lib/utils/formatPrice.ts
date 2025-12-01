/**
 * Format price with currency symbol
 * @param price - Price as string or number
 * @returns Formatted price with ฿ symbol (e.g., "1,500฿")
 */
export function formatPriceWithCurrency(price: string | number): string {
  return `${price}฿`;
}
