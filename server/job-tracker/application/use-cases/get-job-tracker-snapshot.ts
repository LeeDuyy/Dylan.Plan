import type { JobApplicationEntity } from "../../domain/entities/job-application";
import type { JobPlatformEntity } from "../../domain/entities/job-platform";
import type { JobApplicationRepository } from "../../domain/repositories/job-application-repository";
import type { JobPlatformRepository } from "../../domain/repositories/job-platform-repository";
import type { DefaultJobPlatformsService } from "../../domain/services/default-job-platforms-service";
import type { JobStatusAutomationService } from "../../domain/services/job-status-automation-service";

export type JobTrackerSnapshot = {
  jobs: JobApplicationEntity[];
  platforms: JobPlatformEntity[];
};

export type GetJobTrackerSnapshotDeps = {
  jobApplicationRepository: JobApplicationRepository;
  jobPlatformRepository: JobPlatformRepository;
  defaultJobPlatformsService: DefaultJobPlatformsService;
  jobStatusAutomationService: JobStatusAutomationService;
};

export function createGetJobTrackerSnapshotUseCase(deps: GetJobTrackerSnapshotDeps) {
  return async function getJobTrackerSnapshot(): Promise<JobTrackerSnapshot> {
    await deps.defaultJobPlatformsService.ensureDefaultJobPlatforms();
    const [jobs, platforms] = await Promise.all([
      deps.jobApplicationRepository.findAll(),
      deps.jobPlatformRepository.findAll()
    ]);

    const automaticStatusUpdates = deps.jobStatusAutomationService.computeAutomaticStatusUpdates(jobs, new Date());
    await Promise.all(
      automaticStatusUpdates.map((update) => deps.jobApplicationRepository.update(update.id, { status: update.status }))
    );

    const statusByJobId = new Map(automaticStatusUpdates.map((update) => [update.id, update.status]));
    const updatedJobs = jobs.map((job) => {
      const status = statusByJobId.get(job.id);
      return status ? { ...job, status } : job;
    });

    return { jobs: updatedJobs, platforms };
  };
}
