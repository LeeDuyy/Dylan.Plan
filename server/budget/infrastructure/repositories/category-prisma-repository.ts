import type { PrismaClient } from "@/generated/prisma/client";

import type { CategoryEntity } from "../../domain/entities/category";
import type {
  CategoryRepository,
  CreateCategoryInput,
  UpdateCategoryInput
} from "../../domain/repositories/category-repository";

type CategoryRow = {
  id: string;
  monthId: string;
  name: string;
  type: string;
  budget: number;
  locked: boolean;
  isFallback: boolean;
  order: number;
};

function toEntity(row: CategoryRow): CategoryEntity {
  return {
    id: row.id,
    monthId: row.monthId,
    name: row.name,
    type: row.type,
    budget: row.budget,
    locked: row.locked,
    isFallback: row.isFallback,
    order: row.order
  };
}

export function createCategoryPrismaRepository(prisma: PrismaClient): CategoryRepository {
  return {
    async findAll() {
      const rows = await prisma.category.findMany({ orderBy: [{ monthId: "asc" }, { order: "asc" }] });
      return rows.map(toEntity);
    },
    async findByMonth(monthId) {
      const rows = await prisma.category.findMany({ where: { monthId }, orderBy: { order: "asc" } });
      return rows.map(toEntity);
    },
    async findById(id) {
      const row = await prisma.category.findUnique({ where: { id } });
      return row ? toEntity(row) : null;
    },
    async findFallbackByMonth(monthId) {
      const row = await prisma.category.findFirst({ where: { monthId, isFallback: true } });
      return row ? toEntity(row) : null;
    },
    async create(data: CreateCategoryInput) {
      const order =
        data.order ??
        ((await prisma.category.aggregate({
          where: { monthId: data.monthId },
          _max: { order: true }
        }))._max.order ?? -1) + 1;
      const row = await prisma.category.create({
        data: {
          ...(data.id ? { id: data.id } : {}),
          monthId: data.monthId,
          name: data.name,
          type: data.type,
          budget: data.budget,
          locked: Boolean(data.locked),
          isFallback: Boolean(data.isFallback),
          order
        }
      });
      return toEntity(row);
    },
    async upsert(data) {
      const row = await prisma.category.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          monthId: data.monthId,
          name: data.name,
          type: data.type,
          budget: data.budget,
          locked: data.locked,
          isFallback: data.isFallback,
          order: data.order
        },
        update: {
          name: data.name,
          type: data.type,
          budget: data.budget,
          locked: data.locked,
          isFallback: data.isFallback,
          order: data.order
        }
      });
      return toEntity(row);
    },
    async update(id, patch: UpdateCategoryInput) {
      const row = await prisma.category.update({ where: { id }, data: patch });
      return toEntity(row);
    },
    async reorder(monthId, orderedIds) {
      await prisma.$transaction(
        orderedIds.map((id, index) =>
          prisma.category.update({
            where: { id },
            data: { order: index }
          })
        )
      );
    },
    async delete(id) {
      await prisma.category.delete({ where: { id } });
    }
  };
}
