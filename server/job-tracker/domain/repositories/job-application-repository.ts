import type { JobApplicationEntity, JobApplicationStatus } from "../entities/job-application";

export type CreateJobApplicationInput = {
  company: string;
  deadline: Date;
  platformId: string;
  link: string;
  status: JobApplicationStatus;
  note: string | null;
};

export type UpdateJobApplicationInput = Partial<
  Pick<JobApplicationEntity, "company" | "deadline" | "platformId" | "link" | "status" | "note" | "submittedAt">
>;

export interface JobApplicationRepository {
  findById(id: string): Promise<JobApplicationEntity | null>;
  findAll(): Promise<JobApplicationEntity[]>;
  create(data: CreateJobApplicationInput): Promise<JobApplicationEntity>;
  update(id: string, patch: UpdateJobApplicationInput): Promise<JobApplicationEntity>;
  delete(id: string): Promise<void>;
  countByPlatform(platformId: string): Promise<number>;
}
