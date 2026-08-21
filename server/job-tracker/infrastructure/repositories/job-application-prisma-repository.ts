import type { PrismaClient } from "@/generated/prisma/client";
import { prisma as defaultPrisma } from "@/lib/prisma";

import type { JobApplicationEntity, JobApplicationStatus } from "../../domain/entities/job-application";
import type {
  CreateJobApplicationInput,
  JobApplicationRepository,
  UpdateJobApplicationInput
} from "../../domain/repositories/job-application-repository";

type JobApplicationRow = {
  id: string;
  company: string;
  deadline: Date;
  platformId: string;
  link: string;
  status: string;
  note: string | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function toEntity(row: JobApplicationRow): JobApplicationEntity {
  return {
    id: row.id,
    company: row.company,
    deadline: row.deadline,
    platformId: row.platformId,
    link: row.link,
    status: row.status as JobApplicationStatus,
    note: row.note,
    submittedAt: row.submittedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export function createJobApplicationPrismaRepository(prisma: PrismaClient = defaultPrisma): JobApplicationRepository {
  return {
    async findById(id) {
      const row = await prisma.jobApplication.findUnique({ where: { id } });
      return row ? toEntity(row) : null;
    },
    async findAll() {
      const rows = await prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map(toEntity);
    },
    async create(data: CreateJobApplicationInput) {
      const row = await prisma.jobApplication.create({ data });
      return toEntity(row);
    },
    async update(id, patch: UpdateJobApplicationInput) {
      const row = await prisma.jobApplication.update({ where: { id }, data: patch });
      return toEntity(row);
    },
    async delete(id) {
      await prisma.jobApplication.delete({ where: { id } });
    },
    async countByPlatform(platformId) {
      return prisma.jobApplication.count({ where: { platformId } });
    }
  };
}
