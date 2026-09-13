import type { PrismaClient } from "@/generated/prisma/client";
import { prisma as defaultPrisma } from "@/lib/prisma";

import type { NavPrefEntity } from "../../domain/entities/nav-pref";
import type { NavPrefRepository, NavPrefSeedInput } from "../../domain/repositories/nav-pref-repository";

type NavPrefRow = {
  id: string;
  order: number;
  hidden: boolean;
};

function toEntity(row: NavPrefRow): NavPrefEntity {
  return { id: row.id, order: row.order, hidden: row.hidden };
}

export function createNavPrefPrismaRepository(prisma: PrismaClient = defaultPrisma): NavPrefRepository {
  return {
    async findAll() {
      const rows = await prisma.navPref.findMany({ orderBy: { order: "asc" } });
      return rows.map(toEntity);
    },
    async reorder(orderedIds) {
      await prisma.$transaction(
        orderedIds.map((id, index) =>
          prisma.navPref.update({
            where: { id },
            data: { order: index }
          })
        )
      );
    },
    async setHidden(id, hidden) {
      await prisma.navPref.update({ where: { id }, data: { hidden } });
    },
    async deleteAll() {
      await prisma.navPref.deleteMany();
    },
    async createMany(seeds: NavPrefSeedInput[]) {
      await prisma.navPref.createMany({ data: seeds });
    },
    async createDefaultsIfEmpty(seeds: NavPrefSeedInput[]) {
      // Đếm + chèn trong cùng một transaction — SQLite serialize writer nên các
      // request đọc layout gần đồng thời không cùng seed hai lần.
      await prisma.$transaction(async (tx) => {
        const count = await tx.navPref.count();
        if (count > 0) return;
        await tx.navPref.createMany({ data: seeds });
      });
    },
    async insertMissing(seeds: NavPrefSeedInput[]) {
      // SQLite (provider hiện dùng) không hỗ trợ `skipDuplicates` trên createMany
      // — lọc ở tầng ứng dụng: chỉ chèn id chưa có, trong cùng transaction với
      // lệnh đọc để tránh race giống createDefaultsIfEmpty.
      await prisma.$transaction(async (tx) => {
        const existing = await tx.navPref.findMany({ select: { id: true } });
        const existingIds = new Set(existing.map((row) => row.id));
        const missing = seeds.filter((seed) => !existingIds.has(seed.id));
        if (missing.length === 0) return;
        await tx.navPref.createMany({ data: missing });
      });
    },
    async deleteByIdsNotIn(ids: string[]) {
      await prisma.navPref.deleteMany({ where: { id: { notIn: ids } } });
    }
  };
}
