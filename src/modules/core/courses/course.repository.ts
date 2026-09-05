import RepositoryService from "@/modules/internals/repository.service";
import { ICourse } from "./course.interface";
import Course from "./course.model";
import { IResult } from "@/utils/interfaces.util";

class CourseRepository extends RepositoryService<ICourse> {
  constructor() {
    super(Course, "Course");
  }

  /** Creates a course document. */
  async createCourse(courseData: Partial<ICourse>): Promise<IResult> {
    return this.create(courseData);
  }

  /** Finds a course by MongoDB ID, optionally populating related data. */
  async getCourseById(
    courseId: string,
    populate: boolean | Array<{ path: string }> = false,
  ): Promise<IResult> {
    return this.findById(courseId, populate);
  }

  /** Finds a course by MongoDB ID or slug, optionally populating related data. */
  async getCourseByIdOrSlug(
    input: string | number,
    populate: boolean | Array<{ path: string }> = false,
  ): Promise<IResult> {
    return this.findByIdOrSlug(input, populate);
  }

  /** Retrieves courses matching a filter and query options. */
  async getCourses(
    filter?: any,
    options?: {
      select?: string;
      sort?: string;
      page?: number;
      limit?: number;
      populate?: string | any;
    },
  ): Promise<IResult> {
    return this.findAll(filter || {}, options);
  }

  /** Applies a partial update to a course by ID. */
  async updateCourse(
    courseId: string,
    updateData: Partial<ICourse>,
  ): Promise<IResult> {
    return this.update(courseId, updateData);
  }

  /** Checks whether a course already uses the supplied slug. */
  async slugExists(slug: string): Promise<boolean> {
    const existingCourse = await this.getCourseByIdOrSlug(slug);
    return Object.keys(existingCourse.data).length > 0;
  }
}

export default new CourseRepository();
