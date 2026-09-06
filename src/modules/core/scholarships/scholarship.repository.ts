import RepositoryService from "@/modules/internals/repository.service";
import { IResult } from "@/utils/interfaces.util";
import {
  IScholarship,
  ScholarshipStatus,
  ScholarshipTargetType,
} from "./scholarship.interface";
import Scholarship from "./scholarship.model";

class ScholarshipRepository extends RepositoryService<IScholarship> {
  constructor() {
    super(Scholarship, "Scholarship");
  }

  async createScholarship(
    scholarshipData: Partial<IScholarship>,
  ): Promise<IResult> {
    return this.create(scholarshipData);
  }

  async getScholarshipById(scholarshipId: string): Promise<IResult> {
    return this.findById(scholarshipId);
  }

  async getScholarshipByUserAndTarget(
    userId: string,
    targetType: ScholarshipTargetType,
    targetId: string,
  ): Promise<IResult> {
    return this.findOne({
      userId,
      targetType,
      targetId,
    });
  }

  async getPendingScholarshipByUserAndTarget(
    userId: string,
    targetType: ScholarshipTargetType,
    targetId: string,
  ): Promise<IResult> {
    return this.findOne({
      userId,
      targetType,
      targetId,
      status: ScholarshipStatus.PENDING,
    });
  }

  async getActiveScholarshipByUserAndTarget(
    userId: string,
    targetType: ScholarshipTargetType,
    targetId: string,
  ): Promise<IResult> {
    return this.findOne({
      userId,
      targetType,
      targetId,
      status: {
        $in: [ScholarshipStatus.PENDING, ScholarshipStatus.APPROVED],
      },
    });
  }

  async updateScholarship(
    scholarshipId: string,
    updateData: Partial<IScholarship>,
  ): Promise<IResult> {
    return this.update(scholarshipId, updateData);
  }
}

export default new ScholarshipRepository();
