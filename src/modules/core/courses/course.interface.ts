import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface ICourse extends Document {
  id: ObjectId;

  slug: string;
  title: string;
  description: string;
  shortDescription?: string;

  thumbnail?: string;

  price: number; // minor unit
  scholarshipPrice: number; /// minor unit
  currency: string;

  payment: {
    provider: CoursePaymentProvider;
    shopUrl: string;
  };

  status: CourseStatus;

  enrollmentEnabled: boolean;
  scholarshipEnabled: boolean;

  learningOutcomes?: string[];
  requirements?: string[];

  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface CreateCourseDto {
  slug?: string;
  title: string;
  description: string;
  shortDescription?: string;

  thumbnail?: string;

  price: number; // major unit
  scholarshipPrice: number; // major unit
  currency: string;

  payment: {
    provider: CoursePaymentProvider;
    shopUrl: string;
  };

  enrollmentEnabled?: boolean;
  scholarshipEnabled?: boolean;

  learningOutcomes?: string[];
  requirements?: string[];
}

export interface UpdateCourseDto {
  slug?: string;
  title?: string;
  description?: string;
  shortDescription?: string;

  thumbnail?: string;

  price?: number; // major unit
  scholarshipPrice?: number; // major unit
  currency?: string;

  payment?: {
    provider: CoursePaymentProvider;
    shopUrl: string;
  };

  status?: CourseStatus;

  enrollmentEnabled?: boolean;
  scholarshipEnabled?: boolean;

  learningOutcomes?: string[];
  requirements?: string[];
}

export enum CourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum CoursePaymentProvider {
  PAYSTACK = "paystack",
}
