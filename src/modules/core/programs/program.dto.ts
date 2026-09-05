import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface IProgram extends Document {
  _id: ObjectId;

  slug: string;

  title: string;

  description: string;

  shortDescription?: string;

  coverImage?: string;
  thumbnail?: string;

  status: ProgramStatus;

  enrollmentEnabled: boolean;

  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export enum ProgramStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export interface CreateProgramDto {
  title: string;
  description: string;
  shortDescription?: string;
  coverImage?: string;
  thumbnail?: string;
  enrollmentEnabled?: boolean;
}

export interface UpdateProgramDto {
  title?: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  enrollmentEnabled?: boolean;
}
