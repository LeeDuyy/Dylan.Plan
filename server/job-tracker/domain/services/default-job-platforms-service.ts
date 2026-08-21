import type { JobPlatformRepository } from "../repositories/job-platform-repository";

const DEFAULT_JOB_PLATFORM_NAMES = ["ITViec", "LinkedIn", "VietNamWork"] as const;

export type DefaultJobPlatformsServiceDeps = {
  jobPlatformRepository: JobPlatformRepository;
};

export function createDefaultJobPlatformsService(deps: DefaultJobPlatformsServiceDeps) {
  return {
    async ensureDefaultJobPlatforms(): Promise<void> {
      await deps.jobPlatformRepository.createDefaultsIfEmpty([...DEFAULT_JOB_PLATFORM_NAMES]);
    }
  };
}

export type DefaultJobPlatformsService = ReturnType<typeof createDefaultJobPlatformsService>;
