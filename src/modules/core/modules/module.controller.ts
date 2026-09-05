import { Request, Response, NextFunction, RequestHandler } from "express";
import asyncHandler from "@/middlewares/async.mdw";
import moduleService from "./module.service";
import { CreateModuleDto, UpdateModuleDto } from "./module.interface";
import enrollmentService from "@/modules/core/enrollments/enroll.service";
import { EnrollmentTargetType } from "@/modules/core/enrollments/enroll.interface";

import ErrorResponse from "@/utils/error.util";

/**
 * @name createModule
 * @description Creates a module within a course after validating the request payload.
 * @route POST /courses/:courseId/modules
 * @access Private (Admin only)
 */
export const createModule: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;

    if (!courseId) {
      return next(new ErrorResponse("Course ID is required", 400, []));
    }

    const validation = moduleService.validateCreateDto(req.body);

    if (validation.error) {
      return next(
        new ErrorResponse(validation.message, validation.code, validation.data),
      );
    }

    const result = await moduleService.createModule(
      courseId,
      validation.data as CreateModuleDto,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(201).json(result);
  },
);

/**
 * @name getModules
 * @description Retrieves all modules belonging to a course in display order.
 * @route GET /courses/:courseId/modules
 * @access Private (Enrolled users or Admin only)
 */
export const getModules: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;

    if (!courseId) {
      return next(new ErrorResponse("Course ID is required", 400, []));
    }

    if (!req.user?.isAdmin && !req.user?.isSuper) {
      const access = await enrollmentService.checkAccess(
        req.user?._id,
        EnrollmentTargetType.COURSE,
        courseId,
      );

      if (access.error) {
        return next(new ErrorResponse(access.message, access.code, access.data));
      }
    }

    const result = await moduleService.getModules(courseId);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);

/**
 * @name updateModule
 * @description Updates a module within a course after validating the request payload.
 * @route PATCH /courses/:courseId/modules/:moduleId
 * @access Private (Admin only)
 */
export const updateModule: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, moduleId } = req.params;

    if (!courseId) {
      return next(new ErrorResponse("Course ID is required", 400, []));
    }

    if (!moduleId) {
      return next(new ErrorResponse("Module ID is required", 400, []));
    }

    const validation = moduleService.validateUpdateDto(req.body);

    if (validation.error) {
      return next(
        new ErrorResponse(validation.message, validation.code, validation.data),
      );
    }

    const result = await moduleService.updateModule(
      courseId,
      moduleId,
      validation.data as UpdateModuleDto,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);

/**
 * @name getModuleById
 * @description Retrieves a module by ID within its course.
 * @route GET /courses/:courseId/modules/:moduleId
 * @access Private (Enrolled users or Admin only)
 */
export const getModuleById: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, moduleId } = req.params;

    if (!courseId) {
      return next(new ErrorResponse("Course ID is required", 400, []));
    }

    if (!moduleId) {
      return next(new ErrorResponse("Module ID is required", 400, []));
    }

    if (!req.user?.isAdmin && !req.user?.isSuper) {
      const access = await enrollmentService.checkAccess(
        req.user?._id,
        EnrollmentTargetType.COURSE,
        courseId,
      );

      if (access.error) {
        return next(new ErrorResponse(access.message, access.code, access.data));
      }
    }

    const result = await moduleService.getModuleById(courseId, moduleId);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);
