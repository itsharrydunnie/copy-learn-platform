import CourseRepository from "./course.repository";
import {
  CreateCourseDto,
  CoursePaymentProvider,
  UpdateCourseDto,
  CourseStatus,
} from "./course.interface";
import { IResult } from "@/utils/interfaces.util";
import { genSlug } from "@/utils/helpers.util";

class CourseService {
  constructor(private courseRepository = CourseRepository) {}

  /**
   * @name validateCreateDto
   * @description Validates and normalizes the fields accepted when creating a course.
   * @param dto - Unknown request data containing course details, payment information, and optional metadata.
   * @returns An IResult containing a normalized CreateCourseDto on success or validation errors.
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

    if (typeof data.price !== "number" || data.price < 0) {
      errors.push("Price must be a valid non-negative number");
    }
    if (
      typeof data.ScholarshipPrice !== "number" ||
      data.ScholarshipPrice < 0
    ) {
      errors.push("Scholarship Price must be a valid non-negative number");
    }

    if (typeof data.currency !== "string" || !data.currency.trim()) {
      errors.push("Currency is required");
    }

    if (!data.payment || typeof data.payment !== "object") {
      errors.push("Payment information is required");
    } else {
      const payment = data.payment as Record<string, unknown>;

      if (
        !Object.values(CoursePaymentProvider).includes(
          payment.provider as CoursePaymentProvider,
        )
      ) {
        errors.push(
          "Payment provider must be part of Available Payment Providers",
        );
      }

      if (typeof payment.shopUrl !== "string" || !payment.shopUrl.trim()) {
        errors.push("Payment shop URL is required");
      }
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

    if (
      data.enrollmentEnabled !== undefined &&
      typeof data.enrollmentEnabled !== "boolean"
    ) {
      errors.push("Invalid enrollmentEnabled");
    }

    if (
      data.scholarshipEnabled !== undefined &&
      typeof data.scholarshipEnabled !== "boolean"
    ) {
      errors.push("Invalid scholarshipEnabled");
    }

    if (
      data.learningOutcomes !== undefined &&
      (!Array.isArray(data.learningOutcomes) ||
        data.learningOutcomes.some((item) => typeof item !== "string"))
    ) {
      errors.push("Invalid learningOutcomes");
    }

    if (
      data.requirements !== undefined &&
      (!Array.isArray(data.requirements) ||
        data.requirements.some((item) => typeof item !== "string"))
    ) {
      errors.push("Invalid requirements");
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
        shortDescription:
          typeof data.shortDescription === "string"
            ? data.shortDescription.trim()
            : undefined,
        thumbnail:
          typeof data.thumbnail === "string"
            ? data.thumbnail.trim()
            : undefined,
        price: data.price as number,
        scholarshipPrice: data.scholarshipPrice as number,
        currency: (data.currency as string).trim().toUpperCase(),
        payment: {
          provider: (data.payment as Record<string, unknown>)
            .provider as CoursePaymentProvider,
          shopUrl: (data.payment as Record<string, unknown>).shopUrl as string,
        },
        enrollmentEnabled: data.enrollmentEnabled ?? true,
        scholarshipEnabled: data.scholarshipEnabled ?? false,
        learningOutcomes: data.learningOutcomes,
        requirements: data.requirements,
      } as CreateCourseDto,
    };
  }

  /**
   * @name validateUpdateDto
   * @description Validates and normalizes the optional fields accepted for a course update.
   * @param dto - Unknown request data containing one or more supported course fields.
   * @returns An IResult containing a normalized UpdateCourseDto on success or validation errors.
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
    const result: UpdateCourseDto = {};

    if (data.slug !== undefined) {
      if (typeof data.slug !== "string" || !data.slug.trim()) {
        errors.push("Invalid slug");
      } else {
        result.slug = data.slug.trim().toLowerCase();
      }
    }

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

    if (data.price !== undefined) {
      if (typeof data.price !== "number" || data.price < 0) {
        errors.push("Price must be a valid non-negative number");
      } else {
        result.price = data.price;
      }
    }
    if (data.scholarshipPrice !== undefined) {
      if (
        typeof data.scholarshipPrice !== "number" ||
        data.scholarshipPrice < 0
      ) {
        errors.push("Scholarship Price must be a valid non-negative number");
      } else {
        result.scholarshipPrice = data.scholarshipPrice;
      }
    }

    if (data.currency !== undefined) {
      if (typeof data.currency !== "string" || !data.currency.trim()) {
        errors.push("Invalid currency");
      } else {
        result.currency = data.currency.trim().toUpperCase();
      }
    }

    if (data.payment !== undefined) {
      if (!data.payment || typeof data.payment !== "object") {
        errors.push("Invalid payment");
      } else {
        const payment = data.payment as Record<string, unknown>;

        if (
          !Object.values(CoursePaymentProvider).includes(
            payment.provider as CoursePaymentProvider,
          )
        ) {
          errors.push(
            "Payment provider must be part of Available Payment Providers",
          );
        }

        if (typeof payment.shopUrl !== "string" || !payment.shopUrl.trim()) {
          errors.push("Invalid payment shop URL");
        }

        if (
          Object.values(CoursePaymentProvider).includes(
            payment.provider as CoursePaymentProvider,
          ) &&
          typeof payment.shopUrl === "string" &&
          payment.shopUrl.trim()
        ) {
          result.payment = {
            provider: payment.provider as CoursePaymentProvider,
            shopUrl: payment.shopUrl.trim(),
          };
        }
      }
    }

    if (data.status !== undefined) {
      if (
        typeof data.status !== "string" ||
        !Object.values(CourseStatus).includes(data.status as CourseStatus)
      ) {
        errors.push("Invalid status");
      } else {
        result.status = data.status as CourseStatus;
      }
    }

    if (data.enrollmentEnabled !== undefined) {
      if (typeof data.enrollmentEnabled !== "boolean") {
        errors.push("Invalid enrollmentEnabled");
      } else {
        result.enrollmentEnabled = data.enrollmentEnabled;
      }
    }

    if (data.scholarshipEnabled !== undefined) {
      if (typeof data.scholarshipEnabled !== "boolean") {
        errors.push("Invalid scholarshipEnabled");
      } else {
        result.scholarshipEnabled = data.scholarshipEnabled;
      }
    }

    if (data.learningOutcomes !== undefined) {
      if (
        !Array.isArray(data.learningOutcomes) ||
        data.learningOutcomes.some((item) => typeof item !== "string")
      ) {
        errors.push("Invalid learningOutcomes");
      } else {
        result.learningOutcomes = data.learningOutcomes.map((item) =>
          item.trim(),
        );
      }
    }

    if (data.requirements !== undefined) {
      if (
        !Array.isArray(data.requirements) ||
        data.requirements.some((item) => typeof item !== "string")
      ) {
        errors.push("Invalid requirements");
      } else {
        result.requirements = data.requirements.map((item) => item.trim());
      }
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

  // Core Service Methods

  /**
   * @name createCourse
   * @description Generates a unique slug and creates a course.
   * @param dto - Validated course data, including payment details and optional metadata.
   * @returns A promise resolving to the repository IResult for the created course.
   */
  async createCourse(dto: CreateCourseDto): Promise<IResult> {
    let slug = genSlug(dto.title);
    let counter = 1;

    const price = this.toMinorUnit(dto.price);

    while (await this.courseRepository.slugExists(slug)) {
      counter++;
      slug = `${genSlug(dto.title)}-${counter}`;
    }

    return this.courseRepository.createCourse({
      ...dto,
      price,
      slug,
    });
  }

  /**
   * @name toMinorUnit
   * @description Converts a major currency amount to its minor unit representation.
   * @param amount - The currency amount in major units.
   * @returns The currency amount converted to minor units.
   */
  toMinorUnit(amount: number): number {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Invalid amount");
    }

    return Math.round(amount * 100);
  }

  /**
   * @name fromMinorUnit
   * @description Converts a minor currency amount to its major unit representation.
   * @param amount - The currency amount in minor units.
   * @returns The currency amount converted to major units.
   */
  fromMinorUnit(amount: number): number {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Invalid amount");
    }

    return amount / 100;
  }

  /**
   * @name getCourses
   * @description Retrieves published courses using the supplied filters and query options.
   * @param filter - Optional course filters.
   * @param options - Optional selection, sorting, pagination, and population settings.
   * @returns A promise resolving to an IResult containing published courses.
   */
  async getCourses(filter?: any, options?: any): Promise<IResult> {
    return this.courseRepository.getCourses(
      {
        ...filter,
        status: CourseStatus.PUBLISHED,
      },
      options,
    );
  }

  /**
   * @name getAdminCourses
   * @description Retrieves courses for administrative use, including unpublished courses.
   * @param filter - Optional course filters.
   * @param options - Optional selection, sorting, pagination, and population settings.
   * @returns A promise resolving to an IResult containing matching courses.
   */
  async getAdminCourses(filter?: any, options?: any): Promise<IResult> {
    return this.courseRepository.getCourses(filter, options);
  }

  /**
   * @name getCourseById
   * @description Retrieves a course by MongoDB ID.
   * @param courseId - The course ID.
   * @returns A promise resolving to the repository IResult for the requested course.
   */
  async getCourseById(courseId: string): Promise<IResult> {
    const result = await this.courseRepository.getCourseById(courseId);

    if (result.error) {
      return result;
    }

    if (result.data.status !== CourseStatus.PUBLISHED) {
      return {
        error: true,
        message: "Course not found",
        code: 404,
        data: [],
      };
    }

    return result;
  }

  /**
   * @name getCourseBySlug
   * @description Retrieves a course by ID or slug and only returns published courses.
   * @param slug - The course slug or identifier.
   * @returns A promise resolving to the course IResult, or a not-found result when unpublished.
   */
  async getCourseBySlug(slug: string): Promise<IResult> {
    const result = await this.courseRepository.getCourseByIdOrSlug(slug);

    if (result.error) {
      return result;
    }

    if (result.data.status !== CourseStatus.PUBLISHED) {
      return {
        error: true,
        message: "Course not found",
        code: 404,
        data: [],
      };
    }

    return result;
  }

  /**
   * @name updateCourse
   * @description Updates a course with the supplied partial fields after enforcing slug uniqueness.
   * @param courseId - The course ID to update.
   * @param dto - Supported fields to update.
   * @returns A promise resolving to the repository IResult for the updated course.
   */
  async updateCourse(courseId: string, dto: UpdateCourseDto): Promise<IResult> {
    if (dto.slug) {
      const existingCourse = await this.courseRepository.slugExists(dto.slug);

      if (existingCourse) {
        return {
          error: true,
          message: "A course with this slug already exists.",
          code: 400,
          data: [],
        };
      }
    }

    const updateData = { ...dto };

    if (updateData.price !== undefined) {
      updateData.price = this.toMinorUnit(updateData.price);
    }

    return this.courseRepository.updateCourse(courseId, updateData);
  }
}

export default new CourseService();
