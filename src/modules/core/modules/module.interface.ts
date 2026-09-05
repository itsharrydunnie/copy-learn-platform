import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface IModule extends Document {
  courseId: ObjectId;

  title: string;
  description: string;

  order: number;

  startsAt: Date;
  endsAt: Date;

  status: ModuleStatus;

  instructor?: ModuleInstructor;

  meetingUrl?: string;

  recording?: ModuleRecording;

  resources?: ModuleResource[];

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateModuleDto {
  title: string;
  description: string;

  startsAt: Date;
  endsAt: Date;

  instructor?: ModuleInstructor;
  meetingUrl?: string;
  recording?: ModuleRecording;
  resources?: ModuleResource[];
}

export interface UpdateModuleDto {
  title?: string;
  description?: string;

  startsAt?: Date;
  endsAt?: Date;

  status?: ModuleStatus;

  instructor?: ModuleInstructor;
  meetingUrl?: string;
  recording?: ModuleRecording;
  resources?: ModuleResource[];
}

export interface ModuleInstructor {
  name: string;
  title?: string;
  avatar?: string;
}

export interface ModuleRecording {
  url: string;
  availableAt?: Date;
}

export interface ModuleResource {
  title: string;
  url: string;
}

export enum ModuleStatus {
  SCHEDULED = "scheduled",
  CANCELLED = "cancelled",
}
