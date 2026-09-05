import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface IEvent extends Document {
  programId: ObjectId;

  title: string;
  description: string;

  scheduledAt: Date;

  status: EventStatus;

  recordingUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDto {
  title: string;
  description: string;
  scheduledAt: Date;
}

export interface UpdateEventDto {
  title?: string;
  status?: EventStatus;
  description?: string;
  scheduledAt?: Date;
  recordingUrl?: string;
}

export enum EventStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
