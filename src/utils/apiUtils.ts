/**
 * Utility functions for API calls
 */

/**
 * Get the base URL for the application
 * This handles both client and server-side rendering
 */
export const getBaseUrl = (): string => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    // Use the current window location
    return window.location.origin;
  }
  
  // Server-side rendering - use environment variable or default
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
};

/**
 * Get the API URL by combining the base URL with the API path
 * @param path - The API path (e.g., '/api/users')
 */
export const getApiUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  // Ensure path starts with a slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${formattedPath}`;
};
