import asyncHandler from "@/middlewares/async.mdw";
import { NextFunction, Request, RequestHandler, Response } from "express";
import paystackService from "./paystack.service";
import transactionService from "../transaction/transaction.service";

export const paystackWebhook: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["x-paystack-signature"];

    if (typeof signature !== "string") {
      return res.status(401).json({
        error: true,
        message: "Invalid webhook signature",
      });
    }

    const rawBody = req.rawBody;

    const isValid = paystackService.verifyWebhookSignature(signature, rawBody!);

    console.log(isValid, "signature");
    if (!isValid) {
      return res.status(401).json({
        error: true,
        message: "Invalid webhook signature",
      });
    }

    console.log("Webhook received for ", req.body);

    await transactionService.handleWebhook(req.body);

    return res.status(200).json({
      status: true,
      message: "Webhook received",
    });
  },
);
