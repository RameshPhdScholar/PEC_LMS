import { format as dateFnsFormat } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param dateString - The date string to format
 * @param formatStr - The format string to use (default: 'dd MMM yyyy')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date, formatStr: string = 'dd MMM yyyy'): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return dateFnsFormat(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a date range to a readable format
 * @param startDate - The start date string
 * @param endDate - The end date string
 * @param formatStr - The format string to use (default: 'dd MMM yyyy')
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate: string | Date,
  endDate: string | Date,
  formatStr: string = 'dd MMM yyyy'
): string => {
  return `${formatDate(startDate, formatStr)} - ${formatDate(endDate, formatStr)}`;
};

/**
 * Format a currency value
 * @param value - The value to format
 * @param currency - The currency code (default: 'INR')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Format a number with commas
 * @param value - The value to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(value);
};

/**
 * Format a phone number
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return 'N/A';
  
  // Basic formatting for Indian phone numbers
  if (phoneNumber.length === 10) {
    return `+91 ${phoneNumber.substring(0, 5)} ${phoneNumber.substring(5)}`;
  }
  
  return phoneNumber;
};
