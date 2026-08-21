import type { PrismaClient } from "@/generated/prisma/client";
import { prisma as defaultPrisma } from "@/lib/prisma";

import type { JobPlatformEntity } from "../../domain/entities/job-platform";
import type {
  CreateJobPlatformInput,
  JobPlatformRepository
} from "../../domain/repositories/job-platform-repository";

type JobPlatformRow = {
  id: string;
  name: string;
  createdAt: Date;
};

function toEntity(row: JobPlatformRow): JobPlatformEntity {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.createdAt
  };
}

export function createJobPlatformPrismaRepository(prisma: PrismaClient = defaultPrisma): JobPlatformRepository {
  return {
    async findAll() {
      const rows = await prisma.jobPlatform.findMany({ orderBy: { createdAt: "asc" } });
      return rows.map(toEntity);
    },
    async create(data: CreateJobPlatformInput) {
      const row = await prisma.jobPlatform.create({ data: { name: data.name } });
      return toEntity(row);
    },
    async delete(id) {
      await prisma.jobPlatform.delete({ where: { id } });
    },
    async count() {
      return prisma.jobPlatform.count();
    },
    async createDefaultsIfEmpty(names: string[]) {
      // Đếm + chèn trong cùng một transaction: SQLite chỉ cho một transaction
      // ghi chạy tại một thời điểm, transaction sau chỉ thấy count() > 0 sau
      // khi transaction trước đã commit — loại bỏ race giữa nhiều request
      // đọc trang gần như đồng thời.
      await prisma.$transaction(async (tx) => {
        const count = await tx.jobPlatform.count();
        if (count > 0) return;
        await tx.jobPlatform.createMany({ data: names.map((name) => ({ name })) });
      });
    }
  };
}
