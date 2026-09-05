import asyncHandler from "@/middlewares/async.mdw";
import { Request, Response, NextFunction, RequestHandler } from "express";
import programService from "./program.service";
import ErrorResponse from "@/utils/error.util";
import { CreateProgramDto } from "./program.dto";

/**
 * @name createProgram
 * @description Validates and creates a program from the request body.
 * @route POST /admin/programs
 * @access Private (Admin only)
 * @param req.body - Program title, description, and optional metadata.
 * @returns HTTP 201 with the created program result, or forwards validation/creation errors.
 */
export const createProgram: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = programService.validateCreateDto(req.body);

    if (validation.error) {
      return next(
        new ErrorResponse(validation.message, validation.code, validation.data),
      );
    }

    console.log("about to passed to service");
    const result = await programService.createProgram(
      validation.data as CreateProgramDto,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }
    return res.status(201).json(result);
  },
);

/**
 * @name updateProgram
 * @description Validates and updates the program identified by the route parameter.
 * @route PATCH /admin/programs/:programId
 * @access Private (Admin only)
 * @param req.params.programId - The program ID to update.
 * @param req.body - One or more supported program fields to update.
 * @returns HTTP 200 with the updated program result, or forwards validation/update errors.
 */
export const updateProgram: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const programId = req.params.programId;

    const validation = programService.validateUpdateDto(req.body);

    if (validation.error) {
      return next(new ErrorResponse(validation.message, 400, validation.data));
    }

    const result = await programService.updateProgram(
      programId,
      validation.data,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, 400, result.data));
    }

    return res.status(200).json(result);
  },
);

/**
 * @name getPrograms
 * @description Retrieves published programs sorted by creation date.
 * @route GET /programs
 * @access Public
 * @returns HTTP status from the service result with the program list and result metadata.
 */
export const getPrograms: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await programService.getPrograms();
    return res.status(result.code).json(result);
  },
);

/**
 * @name getProgramById
 * @description Retrieves a program by its MongoDB ID.
 * @route GET /programs/:programId
 * @access Public
 * @param req.params.programId - The program ID to retrieve.
 * @returns HTTP status from the service result with the program or an error result.
 */
export const getProgramById: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const programId = req.params.programId;
    const result = await programService.getProgramById(programId);
    return res.status(result.code).json(result);
  },
);

/**
 * @name getProgramBySlug
 * @description Retrieves a published program by its ID or slug parameter.
 * @route GET /programs/slug/:slug
 * @access Public
 * @param req.params.slug - The program slug or identifier to retrieve.
 * @returns HTTP status from the service result with the published program or an error result.
 */
export const getProgramBySlug: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const result = await programService.getProgramBySlug(slug);
    return res.status(result.code).json(result);
  },
);
