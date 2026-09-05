import { Schema, model } from "mongoose";
import { IProgram, ProgramStatus } from "./program.dto";
import { DbModels } from "@/utils/enums.util";

const programSchema = new Schema<IProgram>(
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

    coverImage: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ProgramStatus,
      default: ProgramStatus.DRAFT,
      required: true,
    },

    enrollmentEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Program = model<IProgram>(DbModels.PROGRAM, programSchema);

export default Program;
