import { Request, Response, NextFunction, RequestHandler } from "express";
import asyncHandler from "@/middlewares/async.mdw";
import ErrorResponse from "@/utils/error.util";
import courseService from "./course.service";
import { CreateCourseDto, UpdateCourseDto } from "./course.interface";

/**
 * @name createCourse
 * @description Creates a course after validating the request payload.
 * @route POST /courses
 * @access Private (Admin only)
 */
export const createCourse: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = courseService.validateCreateDto(req.body);

    if (validation.error) {
      return next(
        new ErrorResponse(validation.message, validation.code, validation.data),
      );
    }

    const result = await courseService.createCourse(
      validation.data as CreateCourseDto,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);

/**
 * @name updateCourse
 * @description Updates a course by ID after validating the request payload.
 * @route PATCH /courses/:courseId
 * @access Private (Admin only)
 */
export const updateCourse: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId;

    if (!courseId || !courseId.trim()) {
      return next(new ErrorResponse("Course ID is required", 400, []));
    }

    const validation = courseService.validateUpdateDto(req.body);

    if (validation.error) {
      return next(
        new ErrorResponse(validation.message, validation.code, validation.data),
      );
    }

    const result = await courseService.updateCourse(
      courseId,
      validation.data as UpdateCourseDto,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);

/**
 * @name getCourses
 * @description Retrieves published courses matching the query filters.
 * @route GET /courses
 * @access Public
 */
export const getCourses: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await courseService.getCourses(req.query);

    return res.status(result.code).json(result);
  },
);

/**
 * @name getAdminCourses
 * @description Retrieves courses for administrative use, including unpublished courses.
 * @route GET /courses/admin
 * @access Private (Admin only)
 */
export const getAdminCourses: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await courseService.getAdminCourses(req.query);

    return res.status(result.code).json(result);
  },
);

/**
 * @name getCourseById
 * @description Retrieves a course by its ID.
 * @route GET /courses/:courseId
 * @access Public
 */
export const getCourseById: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.courseId;

    if (!courseId || !courseId.trim()) {
      return next(new ErrorResponse("Course ID is required", 400, []));
    }

    const result = await courseService.getCourseById(courseId);

    return res.status(result.code).json(result);
  },
);

/**
 * @name getCourseBySlug
 * @description Retrieves a published course by its slug.
 * @route GET /courses/slug/:slug
 * @access Public
 */
export const getCourseBySlug: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug;

    const result = await courseService.getCourseBySlug(slug);

    return res.status(result.code).json(result);
  },
);
