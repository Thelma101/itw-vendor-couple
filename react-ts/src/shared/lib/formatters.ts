/**
 * Centralized formatting utilities for date, price, and currency values
 */

/**
 * Format date to readable format (e.g., "Jan 15, 2026")
 * @param value ISO date string or Date
 * @returns Formatted date or original value if invalid
 */
export const formatDate = (value: string | Date) => {
  if (!value) return 'No due date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return String(value)
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Format price/currency to Naira format
 * @param value Number to format
 * @returns Formatted string (e.g., "₦1,500,000")
 */
export const formatPrice = (value: number) => {
  return `₦${value.toLocaleString()}`
}

/**
 * Alias for formatPrice (commonly used in budget tracker)
 */
export const formatCurrency = (value: number) => {
  return `₦${value.toLocaleString()}`
}

/**
 * Format percentage with optional decimal places
 * @param value Number between 0-100
 * @param decimals Decimal places to show
 * @returns Formatted string (e.g., "45.5%")
 */
export const formatPercentage = (value: number, decimals: number = 0) => {
  return `${value.toFixed(decimals)}%`
}
