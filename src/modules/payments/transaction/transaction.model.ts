import mongoose, { Schema, Model } from "mongoose";
import {
  ITransactionDoc,
  TransactionLabel,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";
import { DbModels } from "../../../utils/enums.util";

const TransactionSchema = new Schema<ITransactionDoc>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
      index: true,
    },

    label: {
      type: String,
      enum: Object.values(TransactionLabel),
      required: true,
    },
    description: { type: String },

    reference: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    // money
    currency: { type: String, required: true },
    amount: { type: Number, required: false },
    unitAmount: { type: Number },
    fee: { type: Number, default: 0 },
    unitFee: { type: Number, default: 0 },

    // provider
    providerName: { type: String, required: true },
    providerRef: { type: String },
    providerData: { type: Schema.Types.Mixed },

    // metadata
    metadata: { type: Schema.Types.Mixed },
    channel: { type: String },
    reason: { type: String },
    message: { type: String },
    authorizationUrl: {
      type: String,
      trim: true,
    },
    accessCode: {
      type: String,
      trim: true,
    },

    webhookProcessed: {
      type: Boolean,
      default: false,
    },

    // relations

    userId: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: DbModels.ENROLLMENT,
      index: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: DbModels.COURSE },

    // flags
    policed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      virtuals: true,
      getters: true,
      transform(doc: any, ret) {
        ret.id = ret._id;
        if ("_v" in ret) delete (ret as any)._v;
      },
    },
  },
);

TransactionSchema.index(
  { userId: 1, courseId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: TransactionStatus.PENDING,
    },
  },
);

const Transaction: Model<ITransactionDoc> = mongoose.model<ITransactionDoc>(
  DbModels.TRANSACTION,
  TransactionSchema,
);

export default Transaction;
