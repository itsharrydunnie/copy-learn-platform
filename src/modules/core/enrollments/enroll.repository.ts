import RepositoryService from "@/modules/internals/repository.service";
import { EnrollmentStatus, IEnrollment } from "./enroll.interface";
import Enrollment from "./enroll.model";
import { IResult } from "@/utils/interfaces.util";

class EnrollmentRepository extends RepositoryService<IEnrollment> {
  constructor() {
    super(Enrollment, "Enrollment");
  }

  async createEnrollment(
    enrollmentData: Partial<IEnrollment>,
  ): Promise<IResult> {
    return this.create(enrollmentData);
  }

  async getEnrollmentById(enrollmentId: string): Promise<IResult> {
    return this.findById(enrollmentId);
  }

  async getEnrollment(
    userId: string,
    targetType: string,
    targetId: string,
  ): Promise<IResult> {
    return this.findOne({
      userId,
      targetType,
      targetId,
    });
  }

  async getUserEnrollments(
    userId: string,
    filter: Record<string, unknown> = {},
  ): Promise<IResult> {
    return this.findAll({
      userId,
      ...filter,
    });
  }

  async getActiveEnrollment(
    userId: string,
    targetType: string,
    targetId: string,
  ): Promise<IResult> {
    return this.findOne({
      userId,
      targetType,
      targetId,
      status: EnrollmentStatus.ACTIVE,
    });
  }

  async getPendingEnrollment(
    userId: string,
    targetType: string,
    targetId: string,
  ): Promise<IResult> {
    return this.findOne({
      userId,
      targetType,
      targetId,
      status: EnrollmentStatus.PENDING,
    });
  }

  async updateEnrollment(
    enrollmentId: string,
    updateData: Partial<IEnrollment>,
  ): Promise<IResult> {
    return this.update(enrollmentId, updateData);
  }
}

export default new EnrollmentRepository();
