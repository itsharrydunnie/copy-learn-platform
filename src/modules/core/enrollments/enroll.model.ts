import { Schema, model } from "mongoose";
import {
  IEnrollment,
  EnrollmentTargetType,
  EnrollmentStatus,
  EnrollmentType,
} from "./enroll.interface";
import { DbModels } from "@/utils/enums.util";

const enrollmentSchema = new Schema<IEnrollment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      enum: Object.values(EnrollmentTargetType),
      required: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(EnrollmentStatus),
      required: true,
      default: EnrollmentStatus.PENDING,
    },

    enrollmentType: {
      type: String,
      enum: Object.values(EnrollmentType),
      required: true,
    },

    enrolledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

enrollmentSchema.index(
  {
    userId: 1,
    targetType: 1,
    targetId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: [EnrollmentStatus.PENDING, EnrollmentStatus.ACTIVE] },
    },
  },
);

const Enrollment = model<IEnrollment>(DbModels.ENROLLMENT, enrollmentSchema);

export default Enrollment;
