import RepositoryService from "@/modules/internals/repository.service";
import { IEvent } from "./event.interface";
import Event from "./event.model";
import { IResult } from "@/utils/interfaces.util";

class EventRepository extends RepositoryService<IEvent> {
  constructor() {
    super(Event, "Event");
  }

  /**
   * @name createEvent
   * @description Persists an event using the shared repository create operation.
   * @param eventData - Event fields to persist, including its parent program ID.
   * @returns A promise resolving to an IResult for the created event.
   */
  async createEvent(eventData: Partial<IEvent>): Promise<IResult> {
    return this.create(eventData);
  }

  /**
   * @name getEventById
   * @description Finds an event by MongoDB ID with optional population.
   * @param id - The event ID.
   * @param populate - Whether to populate related data or provide populate paths.
   * @returns A promise resolving to an IResult containing the matching event.
   */
  async getEventById(
    id: string,
    populate: boolean | Array<{ path: string }> = false,
  ): Promise<IResult> {
    return this.findById(id, populate);
  }

  /**
   * @name getEvents
   * @description Finds events matching a filter and applies optional query options.
   * @param filter - Repository filter for event fields.
   * @param options - Optional selection, sorting, pagination, and population settings.
   * @returns A promise resolving to an IResult containing matching events and pagination metadata.
   */
  async getEvents(
    filter?: any,
    options?: {
      select?: string;
      sort?: string;
      page?: number;
      limit?: number;
      populate?: string | any;
    },
  ): Promise<IResult> {
    if (options) {
      return this.findAll(filter || {}, options);
    }

    return this.findAll(filter);
  }

  /**
   * @name updateEvent
   * @description Updates an event by ID using the shared repository update operation.
   * @param eventId - The event ID to update.
   * @param updateData - Event fields to change.
   * @returns A promise resolving to an IResult for the updated event.
   */
  async updateEvent(
    eventId: string,
    updateData: Partial<IEvent>,
  ): Promise<IResult> {
    return this.update(eventId, updateData);
  }
}

export default new EventRepository();
