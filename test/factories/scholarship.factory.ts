import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Scholarship from "../../src/modules/core/scholarships/scholarship.model";
import { ScholarshipStatus, ScholarshipTargetType } from "../../src/modules/core/scholarships/scholarship.interface";

export const buildScholarship = (overrides: Record<string, unknown> = {}) => ({
  userId: new Types.ObjectId(),
  targetType: ScholarshipTargetType.COURSE,
  targetId: new Types.ObjectId(),
  primaryReason: faker.lorem.sentence(),
  experienceLevel: "beginner",
  careerRelevance: faker.lorem.sentence(),
  completionConfidence: faker.lorem.sentence(),
  canPayEnrollmentFee: true,
  status: ScholarshipStatus.PENDING,
  ...overrides,
});

export const createScholarship = async (overrides: Record<string, unknown> = {}) =>
  Scholarship.create(buildScholarship(overrides));
