/**
 * Format a numeric amount into standard Indonesian Rupiah (IDR) currency string.
 *
 * @param amount - Numerical monetary value.
 * @returns Formatted currency string with Rupiah prefix.
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
