import { Job, DoneCallback } from "bull";
import loggerUtil from "@/utils/logger.util";
import scholarshipService from "@/modules/core/scholarships/scholarship.service";

interface ScholarshipJobData {
  scholarshipId: string;
}

const processScholarshipJob = async (
  job: Job<ScholarshipJobData>,
  done: DoneCallback,
): Promise<void> => {
  const { scholarshipId } = job.data;

  loggerUtil.log({
    data: `Processing scholarship job for application ${scholarshipId}`,
    label: "scholarship-job",
    type: "info",
  });

  try {
    const result =
      await scholarshipService.processScholarshipApproval(scholarshipId);

    if (result.error) {
      loggerUtil.log({
        data: result.message,
        label: "scholarship-job",
        type: "error",
      });
    }

    loggerUtil.log({
      data: `Scholarship application ${scholarshipId} processed successfully`,
      label: "scholarship-job",
      type: "success",
    });

    done(null, result.data);
  } catch (error) {
    loggerUtil.log({
      data: `Scholarship job ${job.id} failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      label: "scholarship-job",
      type: "error",
    });

    done(error as Error);
  }
};

export default processScholarshipJob;
