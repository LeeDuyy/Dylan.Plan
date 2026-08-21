import type { JobApplicationStatus } from "../entities/job-application";

export function computeNextSubmittedAt(
  oldStatus: JobApplicationStatus | undefined,
  newStatus: JobApplicationStatus,
  currentSubmittedAt: Date | null,
  now: Date
): Date | null {
  if (oldStatus === "Interested" && newStatus === "Waiting") {
    return now;
  }

  if (oldStatus === "Waiting" && newStatus === "Interested") {
    return null;
  }

  return currentSubmittedAt;
}
