import { Router } from "express";

import Protect from "../../../middlewares/checkAuth.mdw";

import {
  getCourses,
  getCourseById,
  getCourseBySlug,
} from "./course.controller";

import { getModules, getModuleById } from "../modules/module.controller";

const courseRoutes: Router = Router({ mergeParams: true });

// Public
courseRoutes.get("/", getCourses);
courseRoutes.get("/slug/:slug", getCourseBySlug);
courseRoutes.get("/:courseId", getCourseById);

// Modules
courseRoutes.get("/:courseId/modules", Protect, getModules);
courseRoutes.get("/:courseId/modules/:moduleId", Protect, getModuleById);

export default courseRoutes;
