/**
 * Payload used to initialize a Paystack transaction.
 */
export interface NewTransactionDTO {
  userId: string;

  /**
   * Amount in the lowest currency unit.
   * Example:
   * - NGN → kobo
   * - USD → cents
   */
  amount: number;

  currency: Currency;

  /**
   * Customer email required by Paystack.
   */
  email: string;
}

/**
 * Result returned after initializing a Paystack transaction.
 *
 * NOTE:
 * This does NOT mean payment success.
 */
export interface TransactionInitializationResult {
  /**
   * Paystack hosted payment URL.
   */
  authorizationUrl: string;

  /**
   * Unique Paystack transaction reference.
   */
  reference: string;

  /**
   * Paystack access code.
   */
  accessCode: string;
}

export interface PendingDTO {
  amount: number;
  currency: string;
  reference: string;
  userId: string;
}

export enum Currency {
  NGN = "NGN",
}
