import { Schema, model } from "mongoose";
import { IEvent, EventStatus } from "./event.interface";
import { DbModels } from "../../../utils/enums.util";

const eventSchema = new Schema<IEvent>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: DbModels.PROGRAM,
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

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.DRAFT,
      required: true,
      index: true,
    },

    recordingUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Event = model<IEvent>(DbModels.EVENT, eventSchema);

export default Event;
