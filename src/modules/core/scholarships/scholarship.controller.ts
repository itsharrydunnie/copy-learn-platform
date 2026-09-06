import asyncHandler from "@/middlewares/async.mdw";
import { Request, Response, NextFunction, RequestHandler } from "express";
import ErrorResponse from "@/utils/error.util";
import scholarshipService from "./scholarship.service";
import { CreateScholarshipDto } from "./scholarship.interface";

export const createScholarship: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const validation = scholarshipService.validateCreateDto(req.body);

    if (validation.error) {
      return next(
        new ErrorResponse(validation.message, validation.code, validation.data),
      );
    }

    const result = await scholarshipService.createScholarship(
      String(userId),
      validation.data as CreateScholarshipDto,
    );

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code, result.data));
    }

    return res.status(result.code).json(result);
  },
);
