import { Router } from "express";
import Protect from "@/middlewares/checkAuth.mdw";

import {
  createEnrollment,
  getMyEnrollments,
  getMyEnrollment,
  getCourseAccess,
} from "./enroll.controller";

const enrollmentRoutes = Router({ mergeParams: true });

enrollmentRoutes.use(Protect);

enrollmentRoutes.post("/", createEnrollment);

enrollmentRoutes.get("/me", getMyEnrollments);

enrollmentRoutes.get("/me/:targetType/:targetId", getMyEnrollment);

enrollmentRoutes.get("/access/course/:courseId", getCourseAccess);

export default enrollmentRoutes;
