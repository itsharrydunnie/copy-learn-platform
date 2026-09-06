import ProgramRepository from "./program.repository";
import { IResult } from "@/utils/interfaces.util";
import {
  CreateProgramDto,
  ProgramStatus,
  UpdateProgramDto,
} from "./program.dto";
import { genSlug } from "@/utils/helpers.util";

class ProgramService {
  constructor(private readonly programRepository = ProgramRepository) {}

  /**
   * @name validateCreateDto
   * @description Validates and normalizes the fields accepted when creating a program.
   * @param dto - Unknown request data containing title, description, and optional shortDescription, thumbnail, and enrollmentEnabled.
   * @returns An IResult containing a normalized CreateProgramDto on success or validation errors.
   */
  validateCreateDto(dto: unknown): IResult {
    const errors: string[] = [];

    if (!dto || typeof dto !== "object") {
      return {
        code: 400,
        error: true,
        message: "Invalid request body",
        data: ["Invalid request body"],
      };
    }

    const data = dto as Record<string, unknown>;

    if (typeof data.title !== "string" || data.title.trim().length === 0) {
      errors.push("Title is required");
    }

    if (
      typeof data.description !== "string" ||
      data.description.trim().length === 0
    ) {
      errors.push("Description is required");
    }

    if (
      data.shortDescription !== undefined &&
      typeof data.shortDescription !== "string"
    ) {
      errors.push("Invalid shortDescription");
    }

    if (data.thumbnail !== undefined && typeof data.thumbnail !== "string") {
      errors.push("Invalid thumbnail");
    }

    if (data.coverImage !== undefined && typeof data.coverImage !== "string") {
      errors.push("Invalid coverImage");
    }

    if (
      data.enrollmentEnabled !== undefined &&
      typeof data.enrollmentEnabled !== "boolean"
    ) {
      errors.push("Invalid enrollmentEnabled");
    }

    if (errors.length > 0) {
      return {
        code: 400,
        error: true,
        message: "Validation failed",
        data: errors,
      };
    }

    const createDto: CreateProgramDto = {
      title: (data.title as string).trim(),
      description: (data.description as string).trim(),
      shortDescription:
        typeof data.shortDescription === "string"
          ? data.shortDescription.trim()
          : undefined,
      thumbnail:
        typeof data.thumbnail === "string" ? data.thumbnail.trim() : undefined,
      coverImage:
        typeof data.coverImage === "string"
          ? data.coverImage.trim()
          : undefined,
      enrollmentEnabled:
        typeof data.enrollmentEnabled === "boolean"
          ? data.enrollmentEnabled
          : true,
    };

    return {
      code: 200,
      error: false,
      message: "Validation successful",
      data: createDto,
    };
  }

  /**
   * @name validateUpdateDto
   * @description Validates and normalizes the optional fields accepted for a program update.
   * @param dto - Unknown request data containing one or more supported program fields.
   * @returns An IResult containing a normalized UpdateProgramDto on success or validation errors.
   */
  validateUpdateDto(dto: unknown): IResult {
    const errors: string[] = [];

    if (!dto || typeof dto !== "object") {
      return {
        code: 400,
        error: true,
        message: "Invalid request body",
        data: ["Invalid request body"],
      };
    }

    const data = dto as Record<string, unknown>;

    const result: UpdateProgramDto = {};

    if (data.title !== undefined) {
      if (typeof data.title !== "string" || data.title.trim().length === 0) {
        errors.push("Invalid title");
      } else {
        result.title = data.title.trim();
      }
    }

    if (data.description !== undefined) {
      if (
        typeof data.description !== "string" ||
        data.description.trim().length === 0
      ) {
        errors.push("Invalid description");
      } else {
        result.description = data.description.trim();
      }
    }

    if (data.shortDescription !== undefined) {
      if (typeof data.shortDescription !== "string") {
        errors.push("Invalid shortDescription");
      } else {
        result.shortDescription = data.shortDescription.trim();
      }
    }

    if (data.thumbnail !== undefined) {
      if (typeof data.thumbnail !== "string") {
        errors.push("Invalid thumbnail");
      } else {
        result.thumbnail = data.thumbnail.trim();
      }
    }

    if (data.coverImage !== undefined) {
      if (typeof data.coverImage !== "string") {
        errors.push("Invalid coverImage");
      } else {
        result.coverImage = data.coverImage.trim();
      }
    }

    if (data.enrollmentEnabled !== undefined) {
      if (typeof data.enrollmentEnabled !== "boolean") {
        errors.push("Invalid enrollmentEnabled");
      } else {
        result.enrollmentEnabled = data.enrollmentEnabled;
      }
    }

    if (Object.keys(result).length === 0 && errors.length === 0) {
      errors.push("No fields provided for update");
    }

    if (errors.length > 0) {
      return {
        code: 400,
        error: true,
        message: "Validation failed",
        data: errors,
      };
    }

    return {
      code: 200,
      error: false,
      message: "Validation successful",
      data: result,
    };
  }

  /**
   * @name createProgram
   * @description Generates a unique slug and creates a program.
   * @param dto - Validated program data, including title, description, and optional metadata.
   * @returns A promise resolving to the repository IResult for the created program.
   */
  async createProgram(dto: CreateProgramDto): Promise<IResult> {
    // generate slug from title
    const baseSlug = genSlug(dto.title);

    let slug = baseSlug;
    let counter = 1;

    while (await this.programRepository.slugExists(slug)) {
      counter++;
      slug = `${genSlug(dto.title)}-${counter}`;
    }

    return this.programRepository.createProgram({ ...dto, slug });
  }

  /**
   * @name getProgramById
   * @description Retrieves a program by MongoDB ID.
   * @param id - The program ID.
   * @returns A promise resolving to the repository IResult for the requested program.
   */
  async getProgramById(id: string): Promise<IResult> {
    const program = await this.programRepository.getProgramById(id);

    if (program.error) {
      return program;
    }

    if (program.data.status !== ProgramStatus.PUBLISHED) {
      let result: IResult = {
        error: true,
        message: "",
        code: 404,
        data: {},
      };
      result.message = "Program not found or not published.";

      return result;
    }
    return program;
  }

  /**
   * @name getProgramBySlug
   * @description Retrieves a program by ID or slug and only returns published programs.
   * @param slug - The program slug or identifier.
   * @returns A promise resolving to the program IResult, or a not-found result when unpublished.
   */
  async getProgramBySlug(slug: string): Promise<IResult> {
    let result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };
    const program = await this.programRepository.getProgramByIdOrSlug(slug);

    if (program.error) {
      return program;
    }

    if (program.data.status !== ProgramStatus.PUBLISHED) {
      result.error = true;
      result.code = 404;
      result.message = "Program not found or not published.";

      return result;
    }
    return program;
  }

  /**
   * @name getPrograms
   * @description Retrieves all published programs sorted newest first.
   * @returns A promise resolving to an IResult containing the published program list.
   */
  async getPrograms(): Promise<IResult> {
    return this.programRepository.getPrograms(
      { status: "published" },
      { sort: "-createdAt" },
    );
  }

  /**
   * @name getProgramsAdmin
   * @description Retrieves all programs for administrative use, including unpublished programs.
   * @returns A promise resolving to an IResult containing the complete program list.
   */
  async getProgramsAdmin(): Promise<IResult> {
    return this.programRepository.getPrograms({}, { sort: "-createdAt" });
  }

  /**
   * @name updateProgram
   * @description Updates a program with the supplied partial fields.
   * @param id - The program ID to update.
   * @param dto - Supported fields to update: title, description, shortDescription, thumbnail, and enrollmentEnabled.
   * @returns A promise resolving to the repository IResult for the updated program.
   */
  async updateProgram(
    id: string,
    dto: Partial<UpdateProgramDto>,
  ): Promise<IResult> {
    return this.programRepository.updateProgram(id, dto);
  }
}

export default new ProgramService();
