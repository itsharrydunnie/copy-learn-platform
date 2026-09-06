import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface IScholarship extends Document {
  userId: ObjectId;

  targetType: ScholarshipTargetType;
  targetId: ObjectId;

  primaryReason: string;
  experienceLevel: string;
  careerRelevance: string;
  completionConfidence: string;
  canPayEnrollmentFee: boolean;

  status: ScholarshipStatus;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScholarshipDto {
  targetType: ScholarshipTargetType;
  targetId: string;

  primaryReason: string;
  experienceLevel: string;
  careerRelevance: string;
  completionConfidence: string;
  canPayEnrollmentFee: boolean;
}

export enum ScholarshipTargetType {
  COURSE = "course",
}

export enum ScholarshipStatus {
  PENDING = "pending",
  APPROVED = "approved",
  PAID = "paid",
  REJECTED = "rejected",
  EXPIRED = "expired",
}
