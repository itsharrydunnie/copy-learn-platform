import { Router } from "express";
import Protect from "../../../middlewares/checkAuth.mdw";
import checkAdmin from "../../../middlewares/checkAdmin.mdw";
import {
  inviteAdmin,
  acceptAdminInvitation,
  setAdminPassword,
  revokeAdminInvitation,
  createAdmin,
  getAdmin,
  getAdmins,
  getAdminProfile,
  updateAdmin,
  deleteAdmin,
} from "./admin.controller";
import {
  createProgram,
  updateProgram,
} from "../../core/programs/program.controller";
import {
  createEvent,
  updateEvent,
  getAdminEvents,
} from "../../core/events/event.controller";
import {
  createCourse,
  updateCourse,
  getAdminCourses,
} from "../../core/courses/course.controller";
import {
  createModule,
  updateModule,
  getModuleById,
  getModules,
} from "../../core/modules/module.controller";

const adminRoutes: Router = Router({ mergeParams: true });

// Admin invitation routes (must be called before profile routes)
adminRoutes.post("/invite", Protect, inviteAdmin);
adminRoutes.post("/invite/accept", acceptAdminInvitation);
adminRoutes.post("/invite/revoke", Protect, revokeAdminInvitation);

// Admin password routes
adminRoutes.post("/set-password", Protect, setAdminPassword);

// Admin profile routes
adminRoutes.post("/", Protect, createAdmin);
adminRoutes.get("/", Protect, getAdminProfile);
adminRoutes.get("/list", Protect, getAdmins);
adminRoutes.get("/:id", Protect, getAdmin);
adminRoutes.put("/:id", Protect, updateAdmin);
adminRoutes.delete("/:id", Protect, deleteAdmin);

// Admin routes for managing Programs and Events
adminRoutes.post("/programs", Protect, checkAdmin, createProgram);
adminRoutes.patch("/programs/:programId", Protect, checkAdmin, updateProgram);

adminRoutes.get("/programs/:programId/events", Protect, checkAdmin, getAdminEvents);
adminRoutes.post("/programs/:programId/events", Protect, checkAdmin, createEvent);
adminRoutes.patch("/programs/:programId/events/:eventId", Protect, checkAdmin, updateEvent);

// Admin routes for managing Courses and Modules
adminRoutes.get("/courses", Protect, checkAdmin, getAdminCourses);
adminRoutes.post("/courses", Protect, checkAdmin, createCourse);
adminRoutes.patch("/courses/:courseId", Protect, checkAdmin, updateCourse);

adminRoutes.get("/courses/:courseId/modules", Protect, checkAdmin, getModules);
adminRoutes.post("/courses/:courseId/modules", Protect, checkAdmin, createModule);
adminRoutes.get("/courses/:courseId/modules/:moduleId", Protect, checkAdmin, getModuleById);
adminRoutes.patch(
  "/courses/:courseId/modules/:moduleId",
  Protect,
  checkAdmin,
  updateModule,
);

export default adminRoutes;
