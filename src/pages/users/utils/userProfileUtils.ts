
import { UserProfile } from "../types";

/**
 * Utility functions for user profiles
 */

/**
 * Format a subscription status for display
 */
export const formatSubscriptionStatus = (status: string | undefined | null): string => {
  if (!status) return "Non abonné";
  
  const statusMap: Record<string, string> = {
    active: "Actif",
    trialing: "Période d'essai",
    canceled: "Annulé",
    past_due: "Paiement en retard",
    unpaid: "Non payé",
    incomplete: "Incomplet",
    incomplete_expired: "Expiré"
  };
  
  return statusMap[status] || status;
};

/**
 * Format a subscription period end date for display
 */
export const formatSubscriptionEndDate = (date: string | undefined | null): string => {
  if (!date) return "-";
  
  try {
    const endDate = new Date(date);
    return endDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return date;
  }
};
