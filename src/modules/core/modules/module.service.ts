import ModuleRepository from "./module.repository";
import CourseRepository from "../courses/course.repository";

import {
  CreateModuleDto,
  UpdateModuleDto,
  ModuleStatus,
  ModuleResource,
} from "./module.interface";
import { IResult } from "@/utils/interfaces.util";
import { Types } from "mongoose";

class ModuleService {
  constructor(
    private moduleRepository = ModuleRepository,
    private courseRepository = CourseRepository,
  ) {}

  /**
   * @name validateCreateDto
   * @description Validates and normalizes the fields accepted when creating a module.
   * @param dto - Unknown request data containing module schedule, instructor, recording, and resource details.
   * @returns An IResult containing a normalized CreateModuleDto on success or validation errors.
   */
  validateCreateDto(dto: unknown): IResult {
    const errors: string[] = [];

    if (!dto || typeof dto !== "object") {
      return {
        error: true,
        message: "Invalid request body",
        code: 400,
        data: ["Invalid request body"],
      };
    }

    const data = dto as Record<string, unknown>;

    if (typeof data.title !== "string" || !data.title.trim()) {
      errors.push("Title is required");
    }

    if (typeof data.description !== "string" || !data.description.trim()) {
      errors.push("Description is required");
    }

    if (
      typeof data.startsAt !== "string" ||
      !data.startsAt.trim() ||
      isNaN(Date.parse(data.startsAt))
    ) {
      errors.push("Valid startsAt is required");
    }

    if (
      typeof data.endsAt !== "string" ||
      !data.endsAt.trim() ||
      isNaN(Date.parse(data.endsAt))
    ) {
      errors.push("Valid endsAt is required");
    }

    if (
      typeof data.startsAt === "string" &&
      typeof data.endsAt === "string" &&
      !isNaN(Date.parse(data.startsAt)) &&
      !isNaN(Date.parse(data.endsAt)) &&
      new Date(data.endsAt) <= new Date(data.startsAt)
    ) {
      errors.push("endsAt must be after startsAt");
    }

    if (data.instructor !== undefined) {
      if (!data.instructor || typeof data.instructor !== "object") {
        errors.push("Invalid instructor");
      } else {
        const instructor = data.instructor as Record<string, unknown>;

        if (typeof instructor.name !== "string" || !instructor.name.trim()) {
          errors.push("Instructor name is required");
        }

        if (
          instructor.title !== undefined &&
          typeof instructor.title !== "string"
        ) {
          errors.push("Invalid instructor title");
        }

        if (
          instructor.avatar !== undefined &&
          typeof instructor.avatar !== "string"
        ) {
          errors.push("Invalid instructor avatar");
        }
      }
    }

    if (data.meetingUrl !== undefined && typeof data.meetingUrl !== "string") {
      errors.push("Invalid meetingUrl");
    }

    if (data.recording !== undefined) {
      if (!data.recording || typeof data.recording !== "object") {
        errors.push("Invalid recording");
      } else {
        const recording = data.recording as Record<string, unknown>;

        if (typeof recording.url !== "string" || !recording.url.trim()) {
          errors.push("Recording URL is required");
        }

        if (
          recording.availableAt !== undefined &&
          (typeof recording.availableAt !== "string" ||
            isNaN(Date.parse(recording.availableAt)))
        ) {
          errors.push("Invalid recording availableAt");
        }
      }
    }

    if (data.resources !== undefined) {
      if (!Array.isArray(data.resources)) {
        errors.push("Invalid resources");
      } else {
        data.resources.forEach((resource, index) => {
          if (!resource || typeof resource !== "object") {
            errors.push(`Invalid resource at index ${index}`);
            return;
          }

          const item = resource as Record<string, unknown>;

          if (typeof item.title !== "string" || !item.title.trim()) {
            errors.push(`Resource ${index + 1} title is required`);
          }

          if (typeof item.url !== "string" || !item.url.trim()) {
            errors.push(`Resource ${index + 1} URL is required`);
          }
        });
      }
    }

    if (errors.length > 0) {
      return {
        error: true,
        message: "Validation failed",
        code: 400,
        data: errors,
      };
    }

    return {
      error: false,
      message: "Validation successful",
      code: 200,
      data: {
        title: (data.title as string).trim(),
        description: (data.description as string).trim(),
        startsAt: new Date(data.startsAt as string),
        endsAt: new Date(data.endsAt as string),

        instructor: data.instructor
          ? {
              name: (data.instructor as Record<string, unknown>).name as string,
              title:
                typeof (data.instructor as Record<string, unknown>).title ===
                "string"
                  ? (data.instructor as Record<string, unknown>).title
                  : undefined,
              avatar:
                typeof (data.instructor as Record<string, unknown>).avatar ===
                "string"
                  ? (data.instructor as Record<string, unknown>).avatar
                  : undefined,
            }
          : undefined,

        meetingUrl:
          typeof data.meetingUrl === "string"
            ? data.meetingUrl.trim()
            : undefined,

        recording: data.recording
          ? {
              url: (data.recording as Record<string, unknown>).url as string,
              availableAt:
                typeof (data.recording as Record<string, unknown>)
                  .availableAt === "string"
                  ? new Date(
                      (data.recording as Record<string, unknown>)
                        .availableAt as string,
                    )
                  : undefined,
            }
          : undefined,

        resources: Array.isArray(data.resources)
          ? data.resources.map((resource) => ({
              title: (resource as Record<string, unknown>).title as string,
              url: (resource as Record<string, unknown>).url as string,
            }))
          : undefined,
      } as CreateModuleDto,
    };
  }

  /**
   * @name validateUpdateDto
   * @description Validates and normalizes the optional fields accepted for a module update.
   * @param dto - Unknown request data containing one or more supported module fields.
   * @returns An IResult containing a normalized UpdateModuleDto on success or validation errors.
   */
  validateUpdateDto(dto: unknown): IResult {
    const errors: string[] = [];

    if (!dto || typeof dto !== "object") {
      return {
        error: true,
        message: "Invalid request body",
        code: 400,
        data: ["Invalid request body"],
      };
    }

    const data = dto as Record<string, unknown>;
    const result: UpdateModuleDto = {};

    if (data.title !== undefined) {
      if (typeof data.title !== "string" || !data.title.trim()) {
        errors.push("Invalid title");
      } else {
        result.title = data.title.trim();
      }
    }

    if (data.description !== undefined) {
      if (typeof data.description !== "string" || !data.description.trim()) {
        errors.push("Invalid description");
      } else {
        result.description = data.description.trim();
      }
    }

    if (data.startsAt !== undefined) {
      if (
        typeof data.startsAt !== "string" ||
        !data.startsAt.trim() ||
        isNaN(Date.parse(data.startsAt))
      ) {
        errors.push("Invalid startsAt");
      } else {
        result.startsAt = new Date(data.startsAt);
      }
    }

    if (data.endsAt !== undefined) {
      if (
        typeof data.endsAt !== "string" ||
        !data.endsAt.trim() ||
        isNaN(Date.parse(data.endsAt))
      ) {
        errors.push("Invalid endsAt");
      } else {
        result.endsAt = new Date(data.endsAt);
      }
    }

    if (data.status !== undefined) {
      if (
        typeof data.status !== "string" ||
        !Object.values(ModuleStatus).includes(data.status as ModuleStatus)
      ) {
        errors.push("Invalid status");
      } else {
        result.status = data.status as ModuleStatus;
      }
    }

    if (data.instructor !== undefined) {
      if (!data.instructor || typeof data.instructor !== "object") {
        errors.push("Invalid instructor");
      } else {
        const instructor = data.instructor as Record<string, unknown>;

        if (typeof instructor.name !== "string" || !instructor.name.trim()) {
          errors.push("Instructor name is required");
        }

        if (
          instructor.title !== undefined &&
          typeof instructor.title !== "string"
        ) {
          errors.push("Invalid instructor title");
        }

        if (
          instructor.avatar !== undefined &&
          typeof instructor.avatar !== "string"
        ) {
          errors.push("Invalid instructor avatar");
        }

        if (typeof instructor.name === "string") {
          result.instructor = {
            name: instructor.name.trim(),
            title:
              typeof instructor.title === "string"
                ? instructor.title.trim()
                : undefined,
            avatar:
              typeof instructor.avatar === "string"
                ? instructor.avatar.trim()
                : undefined,
          };
        }
      }
    }

    if (data.meetingUrl !== undefined) {
      if (typeof data.meetingUrl !== "string") {
        errors.push("Invalid meetingUrl");
      } else {
        result.meetingUrl = data.meetingUrl.trim();
      }
    }

    if (data.recording !== undefined) {
      if (!data.recording || typeof data.recording !== "object") {
        errors.push("Invalid recording");
      } else {
        const recording = data.recording as Record<string, unknown>;

        if (typeof recording.url !== "string" || !recording.url.trim()) {
          errors.push("Recording URL is required");
        } else {
          result.recording = {
            url: recording.url.trim(),
            availableAt:
              typeof recording.availableAt === "string" &&
              !isNaN(Date.parse(recording.availableAt))
                ? new Date(recording.availableAt)
                : undefined,
          };
        }
      }
    }

    if (data.resources !== undefined) {
      if (!Array.isArray(data.resources)) {
        errors.push("Invalid resources");
      } else {
        const validResources: ModuleResource[] = [];

        data.resources.forEach((resource, index) => {
          if (!resource || typeof resource !== "object") {
            errors.push(`Invalid resource at index ${index}`);
            return;
          }

          const item = resource as Record<string, unknown>;

          if (typeof item.title !== "string" || !item.title.trim()) {
            errors.push(`Resource ${index + 1} title is required`);
          }

          if (typeof item.url !== "string" || !item.url.trim()) {
            errors.push(`Resource ${index + 1} URL is required`);
          }

          if (
            typeof item.title === "string" &&
            typeof item.url === "string" &&
            item.title.trim() &&
            item.url.trim()
          ) {
            validResources.push({
              title: item.title.trim(),
              url: item.url.trim(),
            });
          }
        });

        if (validResources.length === data.resources.length) {
          result.resources = validResources;
        }
      }
    }

    if (result.startsAt && result.endsAt && result.endsAt <= result.startsAt) {
      errors.push("endsAt must be after startsAt");
    }

    if (Object.keys(result).length === 0 && errors.length === 0) {
      errors.push("No fields provided for update");
    }

    if (errors.length > 0) {
      return {
        error: true,
        message: "Validation failed",
        code: 400,
        data: errors,
      };
    }

    return {
      error: false,
      message: "Validation successful",
      code: 200,
      data: result,
    };
  }

  /**
   * @name createModule
   * @description Verifies the course, assigns the next module order, and creates a module.
   * @param courseId - The course ID that will own the module.
   * @param dto - Validated module data.
   * @returns A promise resolving to the repository IResult for the created module.
   */
  async createModule(courseId: string, dto: CreateModuleDto): Promise<IResult> {
    const courseCheck = await this.checkCourseExists(courseId);

    if (courseCheck.error) {
      return courseCheck;
    }
    const lastModule = await this.moduleRepository.getLastModule(courseId);

    const nextOrder = lastModule.data?.order
      ? Number(lastModule.data.order) + 1
      : 1;

    return this.moduleRepository.createModule({
      ...dto,
      courseId: new Types.ObjectId(courseId),
      order: nextOrder,
    });
  }

  /**
   * @name getModules
   * @description Retrieves all modules belonging to a course.
   * @param courseId - The course ID used to scope the lookup.
   * @returns A promise resolving to an IResult containing the course modules.
   */
  async getModules(courseId: string): Promise<IResult> {
    return this.moduleRepository.getModules({
      courseId,
    });
  }

  /**
   * @name getModuleById
   * @description Retrieves a module by ID while restricting the lookup to its course.
   * @param courseId - The course ID used to scope the lookup.
   * @param moduleId - The module ID.
   * @returns A promise resolving to the repository IResult for the requested module.
   */
  async getModuleById(courseId: string, moduleId: string): Promise<IResult> {
    return this.moduleRepository.getModuleByCourse(courseId, moduleId);
  }

  /**
   * @name updateModule
   * @description Updates a module only when it belongs to the supplied course.
   * @param courseId - The course ID used to scope the update.
   * @param moduleId - The module ID to update.
   * @param dto - Supported fields to update.
   * @returns A promise resolving to the repository IResult for the updated module.
   */
  async updateModule(
    courseId: string,
    moduleId: string,
    dto: UpdateModuleDto,
  ): Promise<IResult> {
    return this.moduleRepository.updateModuleByCourse(courseId, moduleId, dto);
  }

  /**
   * @name checkCourseExists
   * @description Verifies that a course exists before allowing a course-scoped module operation.
   * @param courseId - The course ID to verify.
   * @returns A promise resolving to the course lookup result or a not-found result.
   */
  private async checkCourseExists(courseId: string): Promise<IResult> {
    const course = await this.courseRepository.getCourseById(courseId);

    if (course.error || !course.data) {
      return {
        error: true,
        message: "Course not found",
        code: 404,
        data: {},
      };
    }

    return {
      error: false,
      message: "Course found",
      code: 200,
      data: course.data,
    };
  }
}

export default new ModuleService();
