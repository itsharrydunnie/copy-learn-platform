import { Paystack } from "paystack-sdk";
import crypto from "crypto";
import {
  initializePaymentDTO,
  IPaystackVerifyResponse,
  PaystackResponse,
  verifyWebhookDTO,
} from "./paystack.interface";
import dotenv from "dotenv";
dotenv.config();

class PaystackService {
  private readonly paystack: Paystack;
  private readonly secretKey: string;

  constructor(secretKey?: string) {
    const key = secretKey ?? process.env.PAYSTACK_SECRET_KEY;

    if (!key) {
      throw new Error("Paystack secret key not set");
    }

    this.secretKey = key;
    this.paystack = new Paystack(key);
  }

  /** * Initialize a Paystack transaction. * Does NOT confirm payment. */
  async intializePayment(dto: initializePaymentDTO): Promise<PaystackResponse> {
    try {
      const response = await this.paystack.transaction.initialize({
        email: dto.email,
        amount: dto.amount,
        reference: dto.reference, // optional reference from metadata
        callback_url:
          "https://unaxiomatically-adopted-antwan.ngrok-free.dev/api/v1/payment/callback",
        metadata: dto.metadata,
      });
      return response;
    } catch (err) {
      throw new Error("Failed to initialize Paystack transaction");
    }
  }
  /** * Verify a Paystack transaction by reference. */
  async verifyTransaction(reference: string): Promise<IPaystackVerifyResponse> {
    try {
      const response = await this.paystack.transaction.verify(reference);
      return response;
    } catch (err) {
      throw new Error("Failed to verify Paystack transaction");
    }
  }

  /** * Verify a Paystack webhook signature. * * payload MUST be the raw request body. */
  verifyWebhookSignature(signature: string, payload: Buffer | string): boolean {
    const hash = crypto
      .createHmac("sha512", this.secretKey)
      .update(payload)
      .digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  }

  /** * Expose the underlying Paystack SDK if you need * functionality that this service doesn't wrap yet. */ get client(): Paystack {
    return this.paystack;
  }
}

export default new PaystackService();
