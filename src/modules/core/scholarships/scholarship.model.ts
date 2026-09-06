import { Schema, model } from "mongoose";
import {
  IScholarship,
  ScholarshipStatus,
  ScholarshipTargetType,
} from "./scholarship.interface";
import { DbModels } from "@/utils/enums.util";

const scholarshipSchema = new Schema<IScholarship>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: DbModels.USER,
    },

    targetType: {
      type: String,
      enum: Object.values(ScholarshipTargetType),
      required: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    primaryReason: {
      type: String,
      required: true,
      trim: true,
    },

    experienceLevel: {
      type: String,
      required: true,
      trim: true,
    },

    careerRelevance: {
      type: String,
      required: true,
      trim: true,
    },

    completionConfidence: {
      type: String,
      required: true,
      trim: true,
    },

    canPayEnrollmentFee: {
      type: Boolean,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ScholarshipStatus),
      default: ScholarshipStatus.PENDING,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

scholarshipSchema.index({ userId: 1, targetType: 1, targetId: 1 });

const Scholarship = model<IScholarship>(
  DbModels.SCHOLARSHIP,
  scholarshipSchema,
);

export default Scholarship;
