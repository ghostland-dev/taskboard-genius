
/**
 * Utility functions for formatting data
 */

/**
 * Format a date string to local format
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR').format(date);
};
