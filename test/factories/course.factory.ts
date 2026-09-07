import { faker } from "@faker-js/faker";
import Course from "../../src/modules/core/courses/course.model";
import { CoursePaymentProvider, CourseStatus } from "../../src/modules/core/courses/course.interface";

export const buildCourse = (overrides: Record<string, unknown> = {}) => ({
  slug: faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase(),
  title: faker.company.catchPhrase(),
  description: faker.lorem.paragraph(),
  shortDescription: faker.lorem.sentence(),
  thumbnail: faker.image.url(),
  price: 65000000,
  scholarshipPrice: 6500000,
  currency: "NGN",
  payment: { provider: CoursePaymentProvider.PAYSTACK, shopUrl: "https://paystack.shop/pay/test-course" },
  status: CourseStatus.DRAFT,
  enrollmentEnabled: true,
  scholarshipEnabled: true,
  learningOutcomes: [faker.lorem.sentence()],
  requirements: [faker.lorem.sentence()],
  ...overrides,
});

export const createCourse = async (overrides: Record<string, unknown> = {}) =>
  Course.create(buildCourse(overrides));
