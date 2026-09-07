import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Transaction from "../../src/modules/payments/transaction/transaction.model";
import { PaymentProvider, TransactionLabel, TransactionStatus, TransactionType } from "../../src/modules/payments/transaction/transaction.interface";

export const buildTransaction = (overrides: Record<string, unknown> = {}) => ({
  type: TransactionType.PAYMENT,
  status: TransactionStatus.PENDING,
  label: TransactionLabel.COURSE_PAYMENT,
  description: "Course enrollment payment",
  reference: faker.string.alphanumeric(16),
  currency: "NGN",
  amount: 6500000,
  unitAmount: 65000,
  providerName: PaymentProvider.PAYSTACK,
  userId: new Types.ObjectId(),
  enrollmentId: new Types.ObjectId(),
  courseId: new Types.ObjectId(),
  webhookProcessed: false,
  ...overrides,
});

export const createTransaction = async (overrides: Record<string, unknown> = {}) =>
  Transaction.create(buildTransaction(overrides));
