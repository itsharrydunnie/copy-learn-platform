import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Event from "../../src/modules/core/events/event.model";
import { EventStatus } from "../../src/modules/core/events/event.interface";

export const buildEvent = (overrides: Record<string, unknown> = {}) => ({
  programId: new Types.ObjectId(),
  title: faker.company.catchPhrase(),
  description: faker.lorem.paragraph(),
  scheduledAt: faker.date.future(),
  status: EventStatus.DRAFT,
  ...overrides,
});

export const createEvent = async (overrides: Record<string, unknown> = {}) =>
  Event.create(buildEvent(overrides));
