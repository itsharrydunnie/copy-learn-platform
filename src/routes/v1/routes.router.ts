import express, { Request, Response, NextFunction, Router } from "express";
import authRoutes from "../../modules/authentication/auth/auth.router";
import userRoutes from "../../modules/users/user/user.router";
import adminRoutes from "../../modules/users/admin/admin.route";
import storageRoutes from "../../modules/platform/storage/storage.router";
import roleRoutes from "../../modules/authentication/role/role.router";
import previewRoutes from "../../views/preview/preview.router";
import { ENVType } from "@/utils/enums.util";
import ENV from "@/utils/env.util";
import programRoutes from "../../modules/core/programs/program.routes";
import courseRoutes from "../../modules/core/courses/course.route";
import enrollmentRoutes from "../../modules/core/enrollments/enroll.routes";
import { paystackWebhook } from "@/modules/payments/paystack/paystack.controller";
import { paymentCallback } from "@/modules/payments/transaction/transaction.controller";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/programs", programRoutes);
router.use("/courses", courseRoutes);
router.use("/enroll", enrollmentRoutes);
router.use("/storage", storageRoutes);
router.use("/roles", roleRoutes);
router.use("/preview", previewRoutes); // This is used to preview the email templates

// Add new routes
router.post("/webhooks/paystack", paystackWebhook);
router.get("/payment/callback", paymentCallback);

router.get("/me", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    error: false,
    errors: [],
    data: {
      name: "Pacepard Learn API",
      version: "1.00.00",
    },
    message: "Pacepard Learn api v1.0.0 is healthy",
    status: 200,
  });
});

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  let enviornemnt = ENVType.DEVELOPMENT;

  if (ENV.isProduction()) {
    enviornemnt = ENVType.PRODUCTION;
  } else if (ENV.isStaging()) {
    enviornemnt = ENVType.STAGING;
  } else if (ENV.isDevelopment()) {
    enviornemnt = ENVType.DEVELOPMENT;
  }

  res.status(200).render("health-check", {
    error: false,
    errors: [],
    data: {
      name: "Pacepard API",
      version: "01.00.00",
    },
    message: `pacepard-learn-api is running in ${enviornemnt} mode`,
    status: 200,
  });
});

export default router;
