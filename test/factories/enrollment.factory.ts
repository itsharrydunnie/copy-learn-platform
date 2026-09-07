import { Types } from "mongoose";
import Enrollment from "../../src/modules/core/enrollments/enroll.model";
import { EnrollmentStatus,EnrollmentTargetType,EnrollmentType } from "../../src/modules/core/enrollments/enroll.interface";
export const buildEnrollment=(overrides:Record<string,unknown>={})=>({userId:new Types.ObjectId(),targetType:EnrollmentTargetType.COURSE,targetId:new Types.ObjectId(),status:EnrollmentStatus.PENDING,enrollmentType:EnrollmentType.REGULAR,...overrides});
export const createEnrollment=async(overrides:Record<string,unknown>={})=>Enrollment.create(buildEnrollment(overrides));