import { Schema, model } from "mongoose";
import { IModule, ModuleStatus } from "./module.interface";
import { DbModels } from "@/utils/enums.util";

const moduleSchema = new Schema<IModule>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: DbModels.COURSE,
      required: true,
      index: true,
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

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    startsAt: {
      type: Date,
      required: true,
    },

    endsAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ModuleStatus),
      default: ModuleStatus.SCHEDULED,
      required: true,
    },

    instructor: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      title: {
        type: String,
        trim: true,
      },
      avatar: {
        type: String,
        trim: true,
      },
    },

    meetingUrl: {
      type: String,
      trim: true,
    },

    recording: {
      url: {
        type: String,
        trim: true,
      },
      availableAt: {
        type: Date,
      },
    },

    resources: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

moduleSchema.index({ courseId: 1, order: 1 }, { unique: true });

const Module = model<IModule>(DbModels.MODULE, moduleSchema);

export default Module;
