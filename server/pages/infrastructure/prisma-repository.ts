import type { PrismaClient } from "@/generated/prisma/client";
import { prisma as defaultPrisma } from "@/lib/prisma";

import type { PageBlockEntity, PageContentEntity, PageTextEntity } from "../domain/entities";
import type { PageBlockSeed, PageContentRepository, UpsertPageBlockInput } from "../domain/repository";

type BlockRow = {
  id: string;
  page: string;
  section: string;
  order: number;
  badge: string | null;
  title: string | null;
  desc: string | null;
  value: string | null;
  weight: number | null;
  variant: string | null;
  bullets: string | null;
};

function toBlockEntity(row: BlockRow): PageBlockEntity {
  return {
    id: row.id,
    page: row.page,
    section: row.section,
    order: row.order,
    badge: row.badge,
    title: row.title,
    desc: row.desc,
    value: row.value,
    weight: row.weight,
    variant: row.variant,
    bullets: row.bullets
  };
}

export function createPageContentPrismaRepository(prisma: PrismaClient = defaultPrisma): PageContentRepository {
  return {
    async findByPage(page: string): Promise<PageContentEntity> {
      const [textRows, blockRows] = await Promise.all([
        prisma.pageText.findMany({ where: { page } }),
        prisma.pageBlock.findMany({ where: { page }, orderBy: [{ section: "asc" }, { order: "asc" }] })
      ]);
      const texts: PageTextEntity[] = textRows.map((row) => ({ page: row.page, key: row.key, value: row.value }));
      return { texts, blocks: blockRows.map(toBlockEntity) };
    },

    async countByPage(page: string): Promise<number> {
      const [textCount, blockCount] = await Promise.all([
        prisma.pageText.count({ where: { page } }),
        prisma.pageBlock.count({ where: { page } })
      ]);
      return textCount + blockCount;
    },

    async createDefaultsIfEmpty(page, texts, blocks) {
      // Đếm + chèn trong cùng transaction — SQLite serialize writer nên nhiều
      // request đọc trang gần đồng thời không cùng seed hai lần (mẫu
      // NavPrefRepository.createDefaultsIfEmpty).
      await prisma.$transaction(async (tx) => {
        const [textCount, blockCount] = await Promise.all([
          tx.pageText.count({ where: { page } }),
          tx.pageBlock.count({ where: { page } })
        ]);
        if (textCount + blockCount > 0) return;
        if (texts.length > 0) await tx.pageText.createMany({ data: texts });
        if (blocks.length > 0) await tx.pageBlock.createMany({ data: blocks });
      });
    },

    async upsertText(page: string, key: string, value: string): Promise<void> {
      await prisma.pageText.upsert({
        where: { page_key: { page, key } },
        update: { value },
        create: { page, key, value }
      });
    },

    async upsertBlock(input: UpsertPageBlockInput): Promise<PageBlockEntity> {
      const data = {
        badge: input.badge ?? null,
        title: input.title ?? null,
        desc: input.desc ?? null,
        value: input.value ?? null,
        weight: input.weight ?? null,
        variant: input.variant ?? null,
        bullets: input.bullets ?? null
      };
      if (input.id) {
        const row = await prisma.pageBlock.update({ where: { id: input.id }, data });
        return toBlockEntity(row);
      }
      const agg = await prisma.pageBlock.aggregate({
        where: { page: input.page, section: input.section },
        _max: { order: true }
      });
      const order = (agg._max.order ?? -1) + 1;
      const row = await prisma.pageBlock.create({
        data: { page: input.page, section: input.section, order, ...data }
      });
      return toBlockEntity(row);
    },

    async deleteBlock(id: string): Promise<void> {
      await prisma.pageBlock.delete({ where: { id } });
    },

    async reorderBlocks(_page: string, _section: string, orderedIds: string[]): Promise<void> {
      await prisma.$transaction(
        orderedIds.map((id, index) => prisma.pageBlock.update({ where: { id }, data: { order: index } }))
      );
    },

    async resetPage(page: string, texts: PageTextEntity[], blocks: PageBlockSeed[]): Promise<void> {
      await prisma.$transaction(async (tx) => {
        await tx.pageText.deleteMany({ where: { page } });
        await tx.pageBlock.deleteMany({ where: { page } });
        if (texts.length > 0) await tx.pageText.createMany({ data: texts });
        if (blocks.length > 0) await tx.pageBlock.createMany({ data: blocks });
      });
    }
  };
}
