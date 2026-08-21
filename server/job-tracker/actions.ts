"use server";

// Composition root cho bounded-context "job-tracker": nối repository (infrastructure,
// Prisma) -> domain service -> application use-case -> Server Action.

import { createCreateJobPlatformUseCase } from "./application/use-cases/create-job-platform";
import { createDeleteJobApplicationUseCase } from "./application/use-cases/delete-job-application";
import { createDeleteJobPlatformUseCase } from "./application/use-cases/delete-job-platform";
import { createGetJobTrackerSnapshotUseCase } from "./application/use-cases/get-job-tracker-snapshot";
import { createUpsertJobApplicationUseCase } from "./application/use-cases/upsert-job-application";

import { createDefaultJobPlatformsService } from "./domain/services/default-job-platforms-service";
import { createJobPlatformGuardService } from "./domain/services/job-platform-guard-service";
import { createJobStatusAutomationService } from "./domain/services/job-status-automation-service";

import { createJobApplicationPrismaRepository } from "./infrastructure/repositories/job-application-prisma-repository";
import { createJobPlatformPrismaRepository } from "./infrastructure/repositories/job-platform-prisma-repository";

import type { JobApplicationEntity } from "./domain/entities/job-application";
import type { JobPlatformEntity } from "./domain/entities/job-platform";
import type { JobTrackerSnapshot } from "./application/use-cases/get-job-tracker-snapshot";
import type { UpsertJobApplicationInput } from "./application/use-cases/upsert-job-application";

const jobApplicationRepository = createJobApplicationPrismaRepository();
const jobPlatformRepository = createJobPlatformPrismaRepository();

const defaultJobPlatformsService = createDefaultJobPlatformsService({ jobPlatformRepository });
const jobPlatformGuardService = createJobPlatformGuardService({ jobApplicationRepository });
const jobStatusAutomationService = createJobStatusAutomationService();

const getJobTrackerSnapshotUseCase = createGetJobTrackerSnapshotUseCase({
  jobApplicationRepository,
  jobPlatformRepository,
  defaultJobPlatformsService,
  jobStatusAutomationService
});
const upsertJobApplicationUseCase = createUpsertJobApplicationUseCase(jobApplicationRepository);
const deleteJobApplicationUseCase = createDeleteJobApplicationUseCase(jobApplicationRepository);
const createJobPlatformUseCase = createCreateJobPlatformUseCase(jobPlatformRepository);
const deleteJobPlatformUseCase = createDeleteJobPlatformUseCase({
  jobPlatformRepository,
  jobPlatformGuardService
});

export async function getJobTrackerSnapshot(): Promise<JobTrackerSnapshot> {
  return getJobTrackerSnapshotUseCase();
}

export async function createJobApplication(input: UpsertJobApplicationInput): Promise<JobApplicationEntity> {
  return upsertJobApplicationUseCase(input);
}

export async function updateJobApplication(input: UpsertJobApplicationInput): Promise<JobApplicationEntity> {
  return upsertJobApplicationUseCase(input);
}

export async function deleteJobApplication(id: string): Promise<void> {
  return deleteJobApplicationUseCase(id);
}

export async function createJobPlatform(name: string): Promise<JobPlatformEntity> {
  return createJobPlatformUseCase(name);
}

export async function deleteJobPlatform(id: string): Promise<void> {
  return deleteJobPlatformUseCase(id);
}

export type { JobTrackerSnapshot } from "./application/use-cases/get-job-tracker-snapshot";
export type { UpsertJobApplicationInput } from "./application/use-cases/upsert-job-application";
export type { JobApplicationEntity, JobApplicationStatus } from "./domain/entities/job-application";
export type { JobPlatformEntity } from "./domain/entities/job-platform";
