import { revalidatePath } from "next/cache";

import type { JobApplicationRepository } from "../../domain/repositories/job-application-repository";

export function createDeleteJobApplicationUseCase(repository: JobApplicationRepository) {
  return async function deleteJobApplication(id: string): Promise<void> {
    await repository.delete(id);
    revalidatePath("/");
  };
}
