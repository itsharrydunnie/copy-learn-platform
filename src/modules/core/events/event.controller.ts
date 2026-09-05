import { Request, Response, NextFunction, RequestHandler } from "express";
import asyncHandler from "@/middlewares/async.mdw";
import ErrorResponse from "@/utils/error.util";
import eventService from "./event.service";
import { EnrollmentTargetType } from "../enrollments/enroll.interface";
import enrollmentService from "../enrollments/enroll.service";

/**
 * @name getEvents
 * @description Retrieves published events for the requested program.
 * @route GET /programs/:programId/events
 * @access Public
 * @param req.params.programId - The program ID whose published events should be retrieved.
 * @returns HTTP 200 with the published event list, or forwards retrieval errors.
 */
export const getEvents: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { programId } = req.params;

    if (!programId) {
      return next(new ErrorResponse("Program ID is required", 400, []));
    }

    const result = await eventService.getEvents(programId);

    if (result.error) {
      return next(
        new ErrorResponse(
          result.message,
          result.code || 400,
          result.data || [],
        ),
      );
    }

    return res.status(200).json(result);
  },
);

/**
 * @name getAdminEvents
 * @description Retrieves all events for the requested program for administrative use.
 * @route GET /admin/programs/:programId/events
 * @access Private (Admin only)
 * @param req.params.programId - The program ID whose events should be retrieved.
 * @returns HTTP 200 with the event list, or forwards retrieval errors.
 */
export const getAdminEvents: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { programId } = req.params;

    if (!programId) {
      return next(new ErrorResponse("Program ID is required", 400, []));
    }

    const result = await eventService.getAdminEvents(programId, req.query);

    if (result.error) {
      return next(
        new ErrorResponse(
          result.message,
          result.code || 400,
          result.data || [],
        ),
      );
    }

    return res.status(200).json(result);
  },
);

/**
 * @name getEventById
 * @description Retrieves an event belonging to the requested program.
 * @route GET /programs/:programId/events/:eventId
 * @access Private
 * @param req.params.programId - The program ID that should own the event.
 * @param req.params.eventId - The event ID to retrieve.
 * @returns HTTP status from the service result with the event or an error result.
 */
export const getEventById: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { programId, eventId } = req.params;

    const errors: string[] = [];

    if (!programId || !programId.trim()) {
      errors.push("Program ID is required");
    }

    if (!eventId || !eventId.trim()) {
      errors.push("Event ID is required");
    }

    if (errors.length > 0) {
      return next(new ErrorResponse("Validation failed", 400, errors));
    }

    const access = await enrollmentService.checkAccess(
      req.user?._id,
      EnrollmentTargetType.PROGRAM,
      programId,
    );

    if (access.error) {
      return next(new ErrorResponse(access.message, access.code, access.data));
    }
    const result = await eventService.getEventById(programId, eventId);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);

/**
 * @name createEvent
 * @description Validates and creates an event for the requested program.
 * @route POST /admin/programs/:programId/events
 * @access Private (Admin only)
 * @param req.params.programId - The program ID that should own the event.
 * @param req.body - Event title, description, and scheduled date.
 * @returns HTTP status from the service result with the created event or an error result.
 */
export const createEvent: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { programId } = req.params;

    if (!programId || !programId.trim()) {
      return next(new ErrorResponse("Program ID is required", 400, []));
    }

    const validation = eventService.validateCreateDto(req.body);

    if (validation.error) {
      return next(
        new ErrorResponse(
          validation.message,
          validation.code || 400,
          validation.data,
        ),
      );
    }

    const result = await eventService.createEvent(programId, validation.data);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);

/**
 * @name updateEvent
 * @description Validates and updates an event belonging to the requested program.
 * @route PATCH /admin/programs/:programId/events/:eventId
 * @access Private (Admin only)
 * @param req.params.programId - The program ID that should own the event.
 * @param req.params.eventId - The event ID to update.
 * @param req.body - One or more supported event fields to update.
 * @returns HTTP status from the service result with the updated event or an error result.
 */
export const updateEvent: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { programId, eventId } = req.params;

    const errors: string[] = [];

    if (!programId || !programId.trim()) {
      errors.push("Program ID is required");
    }

    if (!eventId || !eventId.trim()) {
      errors.push("Event ID is required");
    }

    if (errors.length > 0) {
      return next(new ErrorResponse("Validation failed", 400, errors));
    }

    const validation = eventService.validateUpdateDto(req.body);

    if (validation.error) {
      return next(
        new ErrorResponse(
          validation.message,
          validation.code || 400,
          validation.data,
        ),
      );
    }

    const result = await eventService.updateEvent(
      programId,
      eventId,
      validation.data,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);
