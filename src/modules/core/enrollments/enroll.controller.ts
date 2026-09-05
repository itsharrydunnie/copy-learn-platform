import asyncHandler from "@/middlewares/async.mdw";
import { Request, Response, NextFunction, RequestHandler } from "express";
import enrollmentService from "./enroll.service";
import ErrorResponse from "@/utils/error.util";
import { CreateEnrollmentDto, EnrollmentTargetType } from "./enroll.interface";

export const createEnrollment: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const validation = enrollmentService.validateCreateDto(req.body);

    if (validation.error) {
      return next(
        new ErrorResponse(validation.message, validation.code, validation.data),
      );
    }

    const result = await enrollmentService.createEnrollment(
      userId!,
      validation.data as CreateEnrollmentDto,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);

export const getMyEnrollments: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const result = await enrollmentService.getUserEnrollments(userId);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);

export const getMyEnrollment: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { targetType, targetId } = req.params;

    if (!targetType) {
      return next(new ErrorResponse("Target type is required", 400, []));
    }

    if (!targetId) {
      return next(new ErrorResponse("Target ID is required", 400, []));
    }

    const result = await enrollmentService.getEnrollment(
      userId,
      targetType,
      targetId,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);

export const getCourseAccess: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const { courseId } = req.params;

    if (!courseId) {
      return next(new ErrorResponse("Course ID is required", 400, []));
    }

    if (!req.user) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const result = await enrollmentService.checkAccess(
      String(userId),
      EnrollmentTargetType.COURSE,
      courseId,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);
