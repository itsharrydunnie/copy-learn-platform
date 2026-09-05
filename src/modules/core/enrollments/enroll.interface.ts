import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface IEnrollment extends Document {
  _id: ObjectId;

  userId: ObjectId;

  targetType: EnrollmentTargetType;
  targetId: ObjectId;

  status: EnrollmentStatus;
  enrollmentType: EnrollmentType;

  enrolledAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEnrollmentDto {
  targetType: EnrollmentTargetType;
  targetId: string;
}

export enum EnrollmentTargetType {
  PROGRAM = "program",
  COURSE = "course",
}

export enum EnrollmentStatus {
  PENDING = "pending",
  ACTIVE = "active",
  CANCELLED = "cancelled",
}

export enum EnrollmentType {
  FREE = "free",
  REGULAR = "regular",
  SCHOLARSHIP = "scholarship",
}
