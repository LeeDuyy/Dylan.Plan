import { revalidatePath } from "next/cache";

import type { JobPlatformRepository } from "../../domain/repositories/job-platform-repository";
import type { JobPlatformGuardService } from "../../domain/services/job-platform-guard-service";

export type DeleteJobPlatformDeps = {
  jobPlatformRepository: JobPlatformRepository;
  jobPlatformGuardService: JobPlatformGuardService;
};

export function createDeleteJobPlatformUseCase(deps: DeleteJobPlatformDeps) {
  return async function deleteJobPlatform(id: string): Promise<void> {
    await deps.jobPlatformGuardService.assertJobPlatformNotInUse(id);
    await deps.jobPlatformRepository.delete(id);
    revalidatePath("/");
  };
}
