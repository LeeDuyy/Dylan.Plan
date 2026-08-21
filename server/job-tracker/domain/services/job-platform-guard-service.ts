import type { JobApplicationRepository } from "../repositories/job-application-repository";

export class JobPlatformInUseError extends Error {}

export type JobPlatformGuardServiceDeps = {
  jobApplicationRepository: JobApplicationRepository;
};

export function createJobPlatformGuardService(deps: JobPlatformGuardServiceDeps) {
  return {
    async assertJobPlatformNotInUse(platformId: string): Promise<void> {
      const count = await deps.jobApplicationRepository.countByPlatform(platformId);
      if (count > 0) {
        throw new JobPlatformInUseError("Không thể xóa Platform đang được job sử dụng.");
      }
    }
  };
}

export type JobPlatformGuardService = ReturnType<typeof createJobPlatformGuardService>;
