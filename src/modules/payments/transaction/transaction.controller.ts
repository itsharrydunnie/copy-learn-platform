import asyncHandler from "@/middlewares/async.mdw";
import ErrorResponse from "@/utils/error.util";
import { NextFunction, Request, RequestHandler, Response } from "express";

export const paymentCallback: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reference } = req.query;

    if (!reference || typeof reference !== "string") {
      return next(new ErrorResponse("Payment reference is required", 400, []));
    }

    return res.status(200).json({
      error: false,
      message: "Payment is currently being processed",
      code: 200,
      data: {
        reference,
      },
    });
  },
);
