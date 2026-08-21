import type { JobApplicationEntity, JobApplicationStatus } from "../entities/job-application";

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

export type AutomaticJobStatusUpdate = {
  id: string;
  status: JobApplicationStatus;
};

export function computeAutomaticStatusUpdates(
  jobs: JobApplicationEntity[],
  now: Date
): AutomaticJobStatusUpdate[] {
  const updates: AutomaticJobStatusUpdate[] = [];

  for (const job of jobs) {
    if (job.status === "Interested" && job.deadline < now) {
      updates.push({ id: job.id, status: "Expired" });
      continue;
    }

    if (
      job.status === "Waiting" &&
      job.submittedAt !== null &&
      now.getTime() - job.submittedAt.getTime() > SEVEN_DAYS_IN_MS
    ) {
      updates.push({ id: job.id, status: "No Response" });
    }
  }

  return updates;
}

export function createJobStatusAutomationService() {
  return {
    computeAutomaticStatusUpdates
  };
}

export type JobStatusAutomationService = ReturnType<typeof createJobStatusAutomationService>;
