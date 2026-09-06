import { Schema, model } from "mongoose";
import {
  ICourse,
  CourseStatus,
  CoursePaymentProvider,
} from "./course.interface";
import { DbModels } from "@/utils/enums.util";

const courseSchema = new Schema<ICourse>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    thumbnail: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    scholarshipPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    payment: {
      provider: {
        type: String,
        enum: Object.values(CoursePaymentProvider),
        required: true,
      },
      shopUrl: {
        type: String,
        required: true,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.DRAFT,
      required: true,
    },

    enrollmentEnabled: {
      type: Boolean,
      default: true,
    },

    scholarshipEnabled: {
      type: Boolean,
      default: false,
    },

    learningOutcomes: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Course = model<ICourse>(DbModels.COURSE, courseSchema);

export default Course;
