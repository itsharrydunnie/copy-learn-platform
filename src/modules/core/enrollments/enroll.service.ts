import EnrollmentRepository from "./enroll.repository";
import {
  EnrollmentTargetType,
  EnrollmentStatus,
  EnrollmentType,
  IEnrollment,
} from "./enroll.interface";
import { CreateEnrollmentDto } from "./enroll.interface";
import { IResult } from "@/utils/interfaces.util";

import ProgramRepository from "../programs/program.repository";
import CourseRepository from "../courses/course.repository";
import { Types } from "mongoose";
import TransactionService from "@/modules/payments/transaction/transaction.service";
import { ICourse } from "../courses/course.interface";

class EnrollmentService {
  constructor(
    private enrollmentRepository = EnrollmentRepository,
    private programRepository = ProgramRepository,
    private courseRepository = CourseRepository,
    private transactionService = TransactionService,
  ) {}

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

    if (
      typeof data.targetType !== "string" ||
      !Object.values(EnrollmentTargetType).includes(
        data.targetType as EnrollmentTargetType,
      )
    ) {
      errors.push("Invalid enrollment target type");
    }

    if (typeof data.targetId !== "string" || !data.targetId.trim()) {
      errors.push("Target ID is required");
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
        targetType: data.targetType as EnrollmentTargetType,
        targetId: (data.targetId as string).trim(),
      } as CreateEnrollmentDto,
    };
  }

  private async checkTargetExists(
    targetType: EnrollmentTargetType,
    targetId: string,
  ): Promise<IResult> {
    if (targetType === EnrollmentTargetType.PROGRAM) {
      return this.programRepository.getProgramById(targetId);
    }

    if (targetType === EnrollmentTargetType.COURSE) {
      return this.courseRepository.getCourseById(targetId);
    }

    return {
      error: true,
      message: "Invalid enrollment target",
      code: 400,
      data: {},
    };
  }

  private async checkExistingEnrollment(
    userId: string,
    targetType: EnrollmentTargetType,
    targetId: string,
  ): Promise<IResult> {
    return this.enrollmentRepository.getEnrollment(
      userId,
      targetType,
      targetId,
    );
  }

  async createEnrollment(
    userId: string,
    dto: CreateEnrollmentDto,
  ): Promise<IResult> {
    const target = await this.checkTargetExists(dto.targetType, dto.targetId);

    if (target.error) {
      return {
        error: true,
        message: target.message,
        code: target.code,
        data: target.data,
      };
    }

    const activeEnrollment = await this.enrollmentRepository.getActiveEnrollment(
      userId,
      dto.targetType,
      dto.targetId,
    );

    if (!activeEnrollment.error && activeEnrollment.data) {
      return {
        error: true,
        message: "User is already enrolled in this target",
        code: 409,
        data: activeEnrollment.data,
      };
    }

    const pendingEnrollment = await this.enrollmentRepository.getPendingEnrollment(
      userId,
      dto.targetType,
      dto.targetId,
    );

    if (!pendingEnrollment.error && pendingEnrollment.data) {
      return this.transactionService.initializePayment(
        String((pendingEnrollment.data as IEnrollment)._id),
        userId,
      );
    }

    /*
     * Program enrollment rules
     */
    if (dto.targetType === EnrollmentTargetType.PROGRAM) {
      return this.enrollmentRepository.createEnrollment({
        userId: new Types.ObjectId(userId),
        targetType: dto.targetType,
        targetId: new Types.ObjectId(dto.targetId),
        status: EnrollmentStatus.ACTIVE,
        enrollmentType: EnrollmentType.FREE,
        enrolledAt: new Date(),
      });
    }

    /*
     * Course enrollment rules
     */
    const course = target.data as ICourse;

    if (!course.enrollmentEnabled) {
      return {
        error: true,
        message: "Enrollment is currently disabled for this course",
        code: 400,
        data: {},
      };
    }

    //create pending enrollment
    const enrollmentResult = await this.enrollmentRepository.createEnrollment({
      userId: new Types.ObjectId(userId),
      targetType: dto.targetType,
      targetId: new Types.ObjectId(dto.targetId),
      status: EnrollmentStatus.PENDING,
      enrollmentType: EnrollmentType.REGULAR,
    });

    if (enrollmentResult.error || !enrollmentResult.data) {
      return enrollmentResult;
    }

    const enrollment = enrollmentResult.data as IEnrollment;

    const initPaymentResult = await this.transactionService.initializePayment(
      String(enrollment._id),
      userId,
    );

    return initPaymentResult;
  }

  async getUserEnrollments(userId: string): Promise<IResult> {
    return this.enrollmentRepository.getUserEnrollments(userId);
  }

  async getEnrollment(
    userId: string,
    targetType: EnrollmentTargetType,
    targetId: string,
  ): Promise<IResult> {
    return this.enrollmentRepository.getEnrollment(
      userId,
      targetType,
      targetId,
    );
  }

  async checkEnrollment(
    userId: string,
    targetType: EnrollmentTargetType,
    targetId: string,
  ): Promise<boolean> {
    const enrollment = await this.enrollmentRepository.getActiveEnrollment(
      userId,
      targetType,
      targetId,
    );

    return !enrollment.error && !!enrollment.data;
  }

  async checkAccess(
    userId: string,
    targetType: EnrollmentTargetType,
    targetId: string,
  ): Promise<IResult> {
    const enrollment = await this.enrollmentRepository.getActiveEnrollment(
      userId,
      targetType,
      targetId,
    );

    if (enrollment.error || !enrollment.data) {
      return {
        error: true,
        message: "Active enrollment required",
        code: 403,
        data: {},
      };
    }

    return {
      error: false,
      message: "Access granted",
      code: 200,
      data: enrollment.data,
    };
  }
}

export default new EnrollmentService();
