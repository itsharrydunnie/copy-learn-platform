import { EnrollmentStatus, IEnrollment } from "./enroll.interface";
import enrollRepository from "./enroll.repository";
import { IResult } from "@/utils/interfaces.util";

// enrollment-activation.service.ts
class EnrollmentActivationService {
  constructor(private enrollmentRepository = enrollRepository) {}

  async activateEnrollment(enrollmentId: string): Promise<IResult> {
    // check for existing pending enrollment
    const enrollmentResult =
      await this.enrollmentRepository.getEnrollmentById(enrollmentId);

    if (enrollmentResult.error) {
      return enrollmentResult;
    }

    const enrollment = enrollmentResult.data as IEnrollment;

    if (enrollment.status === EnrollmentStatus.ACTIVE) {
      return {
        error: false,
        message: "Enrollment is already active",
        code: 200,
        data: enrollment,
      };
    }

    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      return {
        error: true,
        message: "Cancelled enrollment cannot be activated",
        code: 409,
        data: enrollment,
      };
    }

    return this.enrollmentRepository.updateEnrollment(enrollmentId, {
      status: EnrollmentStatus.ACTIVE,
      enrolledAt: new Date(),
    });
  }
}

export default new EnrollmentActivationService();
