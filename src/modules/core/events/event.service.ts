import { CreateEventDto, UpdateEventDto, EventStatus } from "./event.interface";
import EventRepository from "./event.repository";
import ProgramRepository from "../programs/program.repository";
import { IResult } from "@/utils/interfaces.util";
import { Types } from "mongoose";

class EventService {
  constructor(
    private readonly eventRepository = EventRepository,
    private readonly programRepository = ProgramRepository,
  ) {}

  /**
   * @name validateCreateDto
   * @description Validates and normalizes the fields accepted when creating an event.
   * @param dto - Unknown request data containing title, description, and scheduled date.
   * @returns An IResult containing a normalized CreateEventDto on success or validation errors.
   */
  validateCreateDto(dto: unknown): IResult {
    const errors: string[] = [];

    if (!dto || typeof dto !== "object") {
      return {
        code: 400,
        error: true,
        message: "Invalid request body",
        data: ["Invalid request body"],
      };
    }

    const data = dto as Record<string, unknown>;

    if (typeof data.title !== "string" || data.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (
      typeof data.description !== "string" ||
      data.description.trim().length === 0
    ) {
      errors.push("Description is required");
    }

    if (!data.scheduledAt) {
      errors.push("Scheduled date is required");
    } else if (isNaN(new Date(data.scheduledAt as string).getTime())) {
      errors.push("Invalid scheduled date");
    }

    if (errors.length > 0) {
      return {
        code: 400,
        error: true,
        message: "Validation failed",
        data: errors,
      };
    }

    const createDto: CreateEventDto = {
      title: (data.title as string).trim(),
      description: (data.description as string).trim(),
      scheduledAt: new Date(data.scheduledAt as string),
    };

    return {
      code: 200,
      error: false,
      message: "Validation successful",
      data: createDto,
    };
  }

  /**
   * @name validateUpdateDto
   * @description Validates and normalizes the optional fields accepted for an event update.
   * @param dto - Unknown request data containing one or more supported event fields.
   * @returns An IResult containing a normalized UpdateEventDto on success or validation errors.
   */
  validateUpdateDto(dto: unknown): IResult {
    const errors: string[] = [];

    if (!dto || typeof dto !== "object") {
      return {
        code: 400,
        error: true,
        message: "Invalid request body",
        data: ["Invalid request body"],
      };
    }

    const data = dto as Record<string, unknown>;

    const result: UpdateEventDto = {};

    if (data.title !== undefined) {
      if (typeof data.title !== "string" || data.title.trim().length === 0) {
        errors.push("Invalid title");
      } else {
        result.title = data.title.trim();
      }
    }

    if (data.description !== undefined) {
      if (
        typeof data.description !== "string" ||
        data.description.trim().length === 0
      ) {
        errors.push("Invalid description");
      } else {
        result.description = data.description.trim();
      }
    }

    if (data.scheduledAt !== undefined) {
      const date = new Date(data.scheduledAt as string);

      if (isNaN(date.getTime())) {
        errors.push("Invalid scheduled date");
      } else {
        result.scheduledAt = date;
      }
    }

    if (data.recordingUrl !== undefined) {
      if (
        typeof data.recordingUrl !== "string" ||
        data.recordingUrl.trim().length === 0
      ) {
        errors.push("Invalid recording URL");
      } else {
        result.recordingUrl = data.recordingUrl.trim();
      }
    }

    if (data.status !== undefined) {
      if (!Object.values(EventStatus).includes(data.status as EventStatus)) {
        errors.push("Invalid status");
      } else {
        result.status = data.status as EventStatus;
      }
    }

    if (Object.keys(result).length === 0 && errors.length === 0) {
      errors.push("No fields provided for update");
    }

    if (errors.length > 0) {
      return {
        code: 400,
        error: true,
        message: "Validation failed",
        data: errors,
      };
    }

    return {
      code: 200,
      error: false,
      message: "Validation successful",
      data: result,
    };
  }

  private async programExists(programId: string): Promise<IResult> {
    const program = await this.programRepository.getProgramById(programId);

    if (program.error || !program.data) {
      return {
        code: 404,
        error: true,
        message: "Program not found",
        data: [],
      };
    }

    return {
      code: 200,
      error: false,
      message: "Program exists",
      data: program.data,
    };
  }

  /**
   * @name createEvent
   * @description Verifies the parent program and creates an event for it.
   * @param programId - The program ID that owns the event.
   * @param dto - Validated event data, including title, description, and scheduled date.
   * @returns A promise resolving to the repository IResult for the created event.
   */
  async createEvent(programId: string, dto: CreateEventDto): Promise<IResult> {
    // Check program exists
    const program = await this.programExists(programId);

    if (program.error) {
      return program;
    }
    // Create event
    return this.eventRepository.createEvent({
      ...dto,
      programId: new Types.ObjectId(programId),
    });
  }

  /**
   * @name getEvents
   * @description Retrieves published events for a program.
   * @param programId - The program ID whose published events should be retrieved.
   * @param options - Optional selection, sorting, pagination, and population settings.
   * @returns A promise resolving to an IResult containing the published event list.
   */
  async getEvents(
    programId: string,
    options?: {
      select?: string;
      sort?: string;
      page?: number;
      limit?: number;
      populate?: string | any;
    },
  ): Promise<IResult> {
    const program = await this.programExists(programId);

    if (program.error) {
      return program;
    }

    return this.eventRepository.getEvents({
      programId,
      status: EventStatus.PUBLISHED,
    });
  }

  /**
   * @name getAdminEvents
   * @description Retrieves all events for a program for administrative use.
   * @param programId - The program ID whose events should be retrieved.
   * @param options - Optional selection, sorting, pagination, and population settings.
   * @returns A promise resolving to an IResult containing the complete event list.
   */
  async getAdminEvents(
    programId: string,
    options?: {
      select?: string;
      sort?: string;
      page?: number;
      limit?: number;
      populate?: string | any;
    },
  ): Promise<IResult> {
    const program = await this.programExists(programId);

    if (program.error) {
      return program;
    }

    return this.eventRepository.getEvents({ programId }, options);
  }

  /**
   * @name getEventById
   * @description Retrieves an event after verifying that it belongs to the supplied program.
   * @param programId - The program ID that should own the event.
   * @param eventId - The event ID to retrieve.
   * @returns A promise resolving to the event IResult, or a not-found/forbidden result.
   */
  async getEventById(programId: string, eventId: string): Promise<IResult> {
    const program = await this.programExists(programId);

    if (program.error) {
      return program;
    }

    const event = await this.eventRepository.getEventById(eventId);

    if (event.error || !event.data) {
      return {
        code: 404,
        error: true,
        message: "Event not found",
        data: [],
      };
    }

    if (event.data.programId.toString() !== programId) {
      return {
        code: 403,
        error: true,
        message: "Event does not belong to this program",
        data: [],
      };
    }

    return event;
  }

  /**
   * @name updateEvent
   * @description Updates an event after verifying its parent program relationship.
   * @param programId - The program ID that should own the event.
   * @param eventId - The event ID to update.
   * @param dto - Supported event fields to update.
   * @returns A promise resolving to the repository IResult for the updated event.
   */
  async updateEvent(
    programId: string,
    eventId: string,
    dto: UpdateEventDto,
  ): Promise<IResult> {
    const program = await this.programExists(programId);

    if (program.error) {
      return program;
    }

    const event = await this.eventRepository.getEventById(eventId);

    if (event.error || !event.data) {
      return {
        error: true,
        code: 404,
        message: "Event not found",
        data: [],
      };
    }

    if (event.data.programId.toString() !== programId) {
      return {
        error: true,
        code: 403,
        message: "Event does not belong to this program",
        data: [],
      };
    }

    return this.eventRepository.updateEvent(eventId, dto);
  }
}

export default new EventService();
