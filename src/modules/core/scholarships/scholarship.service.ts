import mongoose, { Types } from "mongoose";
import ScholarshipRepository from "./scholarship.repository";
import CourseRepository from "../courses/course.repository";
import emailService from "@/modules/internals/email.service";
import userRepository from "@/modules/users/user/user.repository";
import {
  CreateScholarshipDto,
  ScholarshipStatus,
  ScholarshipTargetType,
} from "./scholarship.interface";
import EnrollmentRepository from "../enrollments/enroll.repository";
import {
  EnrollmentStatus,
  EnrollmentTargetType,
  EnrollmentType,
  IEnrollment,
} from "../enrollments/enroll.interface";

import TransactionRepository from "@/modules/payments/transaction/transaction.repository";
import {
  TransactionLabel,
  TransactionStatus,
  TransactionType,
  PaymentProvider,
} from "@/modules/payments/transaction/transaction.interface";
import { IResult } from "@/utils/interfaces.util";
import BullQueue from "@/queues/queue";
import { JobChannel, QueueChannel } from "@/queues/channel.queue";
import courseService from "../courses/course.service";

class ScholarshipService {
  constructor(
    private readonly scholarshipRepository = ScholarshipRepository,
    private readonly courseRepository = CourseRepository,
    private readonly enrollmentRepository = EnrollmentRepository,
    private readonly transactionRepository = TransactionRepository,
  ) {}

  /**
   * @name validateCreateDto
   * @description Validates and normalizes scholarship application data.
   * @param dto - Unknown request body.
   * @returns An IResult containing the normalized CreateScholarshipDto or validation errors.
   */
  validateCreateDto(dto: unknown): IResult {
    const errors: string[] = [];

    if (!dto || typeof dto !== "object") {
      return {
        error: true,
        message: "Invalid request body",
        code: 400,
        data: {},
      };
    }

    const body = dto as Record<string, unknown>;

    if (body.targetType !== ScholarshipTargetType.COURSE) {
      errors.push("Scholarship target type must be course");
    }

    if (
      typeof body.targetId !== "string" ||
      !mongoose.Types.ObjectId.isValid(body.targetId)
    ) {
      errors.push("Valid course targetId is required");
    }

    if (typeof body.primaryReason !== "string" || !body.primaryReason.trim()) {
      errors.push("Primary reason for applying is required");
    }

    if (
      typeof body.experienceLevel !== "string" ||
      !body.experienceLevel.trim()
    ) {
      errors.push("Experience level is required");
    }

    if (
      typeof body.careerRelevance !== "string" ||
      !body.careerRelevance.trim()
    ) {
      errors.push("Career relevance is required");
    }

    if (
      typeof body.completionConfidence !== "string" ||
      !body.completionConfidence.trim()
    ) {
      errors.push("Completion confidence is required");
    }

    if (typeof body.canPayEnrollmentFee !== "boolean") {
      errors.push("canPayEnrollmentFee must be a boolean");
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
        targetType: body.targetType,
        targetId: body.targetId,
        primaryReason: (body.primaryReason as string).trim(),
        experienceLevel: (body.experienceLevel as string).trim(),
        careerRelevance: (body.careerRelevance as string).trim(),
        completionConfidence: (body.completionConfidence as string).trim(),
        canPayEnrollmentFee: body.canPayEnrollmentFee,
      },
    };
  }

  /**
   * @name createScholarship
   * @description Creates a scholarship application for the authenticated user.
   * @param userId - Authenticated user's ID.
   * @param dto - Validated scholarship application data.
   * @returns A promise resolving to an IResult for the created scholarship application.
   */
  async createScholarship(
    userId: string,
    dto: CreateScholarshipDto,
  ): Promise<IResult> {
    const course = await this.courseRepository.getCourseById(dto.targetId);

    if (course.error || !course.data?._id) {
      return {
        code: 404,
        error: true,
        message: "Course not found",
        data: [],
      };
    }

    if (dto.targetType !== ScholarshipTargetType.COURSE) {
      return {
        code: 400,
        error: true,
        message: "Scholarship target type must be course",
        data: [],
      };
    }

    if (!course.data.scholarshipEnabled) {
      return {
        code: 400,
        error: true,
        message: "Scholarship is not available for this course",
        data: [],
      };
    }

    if (!course.data.enrollmentEnabled) {
      return {
        code: 400,
        error: true,
        message: "Enrollment is not available for this course",
        data: [],
      };
    }

    const existingScholarship =
      await this.scholarshipRepository.getActiveScholarshipByUserAndTarget(
        userId,
        dto.targetType,
        dto.targetId,
      );

    if (!existingScholarship.error && existingScholarship.data?._id) {
      return {
        code: 409,
        error: true,
        message:
          "User already has an active scholarship application for this course",
        data: [],
      };
    }

    const scholarshipData = {
      ...dto,
      userId: new mongoose.Types.ObjectId(userId),
      targetId: new mongoose.Types.ObjectId(dto.targetId),
      status: ScholarshipStatus.PENDING,
    };

    const scholarshipResult =
      await this.scholarshipRepository.createScholarship(scholarshipData);

    if (scholarshipResult.error || !scholarshipResult.data) {
      return scholarshipResult;
    }

    const scholarship = scholarshipResult.data;

    const queue = await BullQueue.createQueue({
      name: QueueChannel.Scholarships,
    });

    await queue.add(
      JobChannel.ProcessScholarship,
      {
        scholarshipId: scholarship._id.toString(),
      },
      {
        // delay: 3 * 24 * 60 * 60 * 1000,
        delay: 30 * 1000,
        jobId: `scholarship-approval-${scholarship._id}`,
      },
    );
    return {
      error: false,
      message: "Scholarship application submitted successfully",
      code: 201,
      data: {},
    };
  }

  /**
   * @name processScholarshipApproval
   * @description Automatically approves a pending scholarship application,
   * creates the pending course enrollment and pending payment transaction.
   * @param scholarshipId - Scholarship application ID.
   * @returns A promise resolving to an IResult for the processed scholarship.
   */
  async processScholarshipApproval(scholarshipId: string): Promise<IResult> {
    const scholarshipResult =
      await this.scholarshipRepository.getScholarshipById(scholarshipId);

    if (scholarshipResult.error || !scholarshipResult.data) {
      return {
        error: true,
        message: "Scholarship application not found",
        code: 404,
        data: {},
      };
    }

    const scholarship = scholarshipResult.data;

    /**
     * Idempotency:
     * If the job is retried after it has already been
     * processed, do not create another enrollment/transaction.
     */
    if (scholarship.status !== ScholarshipStatus.PENDING) {
      // if email sending fails after scholarship was approved,the job can retry and hit this part and the email may never be sent should fix
      return {
        error: false,
        message: "Scholarship application already processed",
        code: 200,
        data: scholarship,
      };
    }

    const courseResult = await this.courseRepository.getCourseById(
      String(scholarship.targetId),
    );

    if (courseResult.error || !courseResult.data) {
      return {
        error: true,
        message: "Course not found",
        code: 404,
        data: {},
      };
    }

    const course = courseResult.data;

    const userId = String(scholarship.userId);
    const courseId = String(scholarship.targetId);

    /**
     * Check whether the delayed job has already created
     * the enrollment.
     */
    let enrollmentResult = await this.enrollmentRepository.getEnrollment(
      userId,
      EnrollmentTargetType.COURSE,
      courseId,
    );

    let enrollment: IEnrollment;

    if (!enrollmentResult.error && enrollmentResult.data) {
      enrollment = enrollmentResult.data as IEnrollment;
    } else {
      const createdEnrollment =
        await this.enrollmentRepository.createEnrollment({
          userId: new Types.ObjectId(userId),
          targetType: EnrollmentTargetType.COURSE,
          targetId: new Types.ObjectId(courseId),
          status: EnrollmentStatus.PENDING,
          enrollmentType: EnrollmentType.SCHOLARSHIP,
        });

      if (createdEnrollment.error || !createdEnrollment.data) {
        return createdEnrollment;
      }

      enrollment = createdEnrollment.data as IEnrollment;
    }

    /**
     * A pending transaction may already exist if the worker
     * was retried after creating it.
     */

    let transactionResult =
      await this.transactionRepository.getPendingTransactionByEnrollmentId(
        String(enrollment._id),
      );

    // No pending transaction found, create new one
    if (transactionResult.error || !transactionResult.data) {
      const transactionReference = `PCPD-TXN-${Date.now()}`;

      transactionResult = await this.transactionRepository.createTransaction({
        type: TransactionType.PAYMENT,
        status: TransactionStatus.PENDING,
        label: TransactionLabel.COURSE_PAYMENT,
        description: `Scholarship course payment of ${course.price} ${course.currency} for user ${userId}`,
        providerName: PaymentProvider.PAYSTACK,
        reference: transactionReference,
        currency: course.currency,
        amount: course.scholarshipPrice,
        userId: new Types.ObjectId(userId),
        enrollmentId: new Types.ObjectId(String(enrollment._id)),
        courseId: new Types.ObjectId(courseId),
        metadata: {
          scholarshipId,
          paymentSource: "shop_url",
        },
      });
    }

    // if there's an error when creating new transaction
    if (transactionResult.error || !transactionResult.data) {
      return transactionResult;
    }

    /**
     * Only approve after the pending enrollment and
     * payment record exist successfully.
     */
    const approvalResult = await this.scholarshipRepository.updateScholarship(
      scholarshipId,
      {
        status: ScholarshipStatus.APPROVED,
      },
    );

    if (approvalResult.error) {
      return approvalResult;
    }

    const userResult = await userRepository.findById(
      String(scholarship.userId),
    );

    if (userResult.error || !userResult.data) {
      return {
        error: true,
        code: 404,
        message: "User not found",
        data: {},
      };
    }

    const emailResult = await emailService.sendScholarshipApprovedEmail(
      userResult.data,
      course,
    );

    if (emailResult.error) {
      return emailResult;
    }

    return {
      error: false,
      message: "Scholarship approved successfully",
      code: 200,
      data: {
        scholarship: approvalResult.data,
        enrollment,
        transaction: transactionResult.data,
        payment: {
          amount: courseService.fromMinorUnit(course.scholarshipPrice),
          currency: course.currency,
          shopUrl: course.payment.shopUrl,
        },
      },
    };
  }
}

export default new ScholarshipService();

/**
 * {
  "targetType": "course",
  "targetId": "66xxxxxxxxxxxxxxxxxxxxxx",
  "primaryReason": "I want to transition into growth engineering.",
  "experienceLevel": "Beginner",
  "careerRelevance": "It directly aligns with my career goals.",
  "completionConfidence": "Very confident",
  "canPayEnrollmentFee": true
}
 */
