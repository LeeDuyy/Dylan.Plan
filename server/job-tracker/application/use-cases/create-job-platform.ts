import { revalidatePath } from "next/cache";

import type { JobPlatformEntity } from "../../domain/entities/job-platform";
import type { JobPlatformRepository } from "../../domain/repositories/job-platform-repository";

export class CreateJobPlatformError extends Error {}

export function createCreateJobPlatformUseCase(repository: JobPlatformRepository) {
  return async function createJobPlatform(name: string): Promise<JobPlatformEntity> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new CreateJobPlatformError("Tên Platform không được để trống.");
    }

    const result = await repository.create({ name: trimmedName });
    revalidatePath("/");
    return result;
  };
}
