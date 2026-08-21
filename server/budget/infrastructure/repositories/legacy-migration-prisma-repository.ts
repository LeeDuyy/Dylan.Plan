import type { PrismaClient } from "@/generated/prisma/client";

import type { LegacyMigrationEntity, MigrationStatusValue } from "../../domain/entities/legacy-migration";
import type { LegacyMigrationRepository } from "../../domain/repositories/legacy-migration-repository";

// DEC-042: đúng một dòng, khoá chính cố định "singleton" (single-user, DEC-004).
const SINGLETON_ID = "singleton";

type LegacyMigrationRow = {
  id: string;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
  errorMessage: string | null;
};

function toEntity(row: LegacyMigrationRow): LegacyMigrationEntity {
  return {
    id: "singleton",
    status: row.status as MigrationStatusValue,
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    errorMessage: row.errorMessage
  };
}

export function createLegacyMigrationPrismaRepository(prisma: PrismaClient): LegacyMigrationRepository {
  return {
    async getStatus() {
      const row = await prisma.legacyMigration.upsert({
        where: { id: SINGLETON_ID },
        create: { id: SINGLETON_ID },
        update: {}
      });
      return toEntity(row);
    },
    async claimInProgress() {
      // Đảm bảo luôn có đúng một dòng "singleton" trước khi cố gắng claim.
      await prisma.legacyMigration.upsert({
        where: { id: SINGLETON_ID },
        create: { id: SINGLETON_ID },
        update: {}
      });
      // Compare-and-swap bằng updateMany: chỉ đổi sang InProgress nếu hiện chưa InProgress.
      const claimed = await prisma.legacyMigration.updateMany({
        where: { id: SINGLETON_ID, status: { not: "InProgress" } },
        data: { status: "InProgress", startedAt: new Date(), errorMessage: null }
      });
      return claimed.count > 0;
    },
    async markCompleted() {
      await prisma.legacyMigration.update({
        where: { id: SINGLETON_ID },
        data: { status: "Completed", completedAt: new Date(), errorMessage: null }
      });
    },
    async markFailed(errorMessage: string) {
      await prisma.legacyMigration.update({
        where: { id: SINGLETON_ID },
        data: { status: "Failed", errorMessage }
      });
    }
  };
}
