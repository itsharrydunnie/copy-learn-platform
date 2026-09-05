import { Router } from "express";
import {
  getPrograms,
  getProgramById,
  getProgramBySlug,
} from "./program.controller";
import { getEvents, getEventById } from "../events/event.controller";
import Protect from "../../../middlewares/checkAuth.mdw";

const programRoutes: Router = Router({ mergeParams: true });

// Program routes
programRoutes.get("/", getPrograms);
programRoutes.get("/slug/:slug", getProgramBySlug);
programRoutes.get("/:programId", getProgramById);

// Event routes
programRoutes.get("/:programId/events", getEvents);
programRoutes.get("/:programId/events/:eventId", Protect, getEventById);

export default programRoutes;
