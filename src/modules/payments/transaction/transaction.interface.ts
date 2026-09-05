import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface ITransactionDoc extends Document {
  type: TransactionType;
  status: TransactionStatus;

  label: TransactionLabel;
  description: string;
  narration: string;

  reference: string;

  // money
  currency: string;
  amount: number;
  unitAmount: number;
  fee: number;
  unitFee: number;

  // provider
  providerName: string;
  providerRef: string;
  providerData: Record<string, any>;

  // metadata
  metadata: Record<string, any>;
  channel: string;
  reason: string;
  message: string;
  authorizationUrl: string;
  accessCode: string;

  // relations
  userId: ObjectId;
  enrollmentId: ObjectId;
  courseId: ObjectId;

  // flags
  policed: boolean;

  webhookProcessed: boolean;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export enum TransactionType {
  PAYMENT = "PAYMENT",
  REFUND = "REFUND",
  REVERSAL = "REVERSAL",
  CHARGEBACK = "CHARGEBACK",
  ADJUSTMENT = "ADJUSTMENT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum TransactionLabel {
  COURSE_PAYMENT = "Course Payment",
}

export enum PaymentProvider {
  PAYSTACK = "paystack",
}
