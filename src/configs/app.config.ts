import express, { type Express, Request } from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import errorHandler from "../middlewares/error.mdw";
import apiRoutes from "../routes/v1/routes.router";
import expressSanitize from "@exortek/express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express();

// body parser
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      (req as Request).rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ limit: "50mb", extended: false }));

// cookie parser
app.use(cookieParser());

// Sanitize data and secure db against sql injection
// Skip when running in Jest (tests) due to Supertest read-only req.query issue
// express-mongo-sanitize tries to modify req.query which is read-only in Supertest
// Check for Jest environment variables or wrap in try-catch
const isJestEnvironment =
  process.env.JEST_WORKER_ID !== undefined ||
  process.env.npm_lifecycle_event === "test" ||
  process.env.npm_lifecycle_event?.includes("test");
if (!isJestEnvironment) {
  app.use(expressSanitize());
}

// Secure response header
app.use(helmet());

// Prevent parameter pollution
app.use(hpp());

// enable CORS: communicate with multiple domain
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }

      // Allow staging domain
      if (origin.includes("staging.pacepard.com")) {
        return callback(null, true);
      }

      // Allow production domain
      if (origin.includes("pacepard.com")) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "lg",
      "ch",
    ],
  }),
);

// Set view engine and views
app.set("view engine", "pug");
app.set("views", join(__dirname, "../views"));

// Routes
app.use("/api/v1", apiRoutes);

// Error handler
app.use(errorHandler);

export default app;
