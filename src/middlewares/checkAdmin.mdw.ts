import { NextFunction, Request, RequestHandler, Response } from "express";
import ErrorResponse from "@/utils/error.util";
import asyncHandler from "./async.mdw";

/** Restricts management routes to authenticated platform administrators. */
const checkAdmin: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || (!req.user.isAdmin && !req.user.isSuper)) {
      return next(new ErrorResponse("Administrator access required", 403, []));
    }

    next();
  },
);

export default checkAdmin;
