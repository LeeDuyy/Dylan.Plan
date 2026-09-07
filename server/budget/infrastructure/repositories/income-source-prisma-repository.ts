import type { PrismaClient } from "@/generated/prisma/client";

import type { IncomeSourceEntity } from "../../domain/entities/income-source";
import type {
  CreateIncomeSourceInput,
  IncomeSourceRepository,
  UpdateIncomeSourceInput
} from "../../domain/repositories/income-source-repository";

type IncomeSourceRow = {
  id: string;
  monthId: string;
  name: string;
  amount: number;
  order: number;
};

function toEntity(row: IncomeSourceRow): IncomeSourceEntity {
  return {
    id: row.id,
    monthId: row.monthId,
    name: row.name,
    amount: row.amount,
    order: row.order
  };
}

export function createIncomeSourcePrismaRepository(prisma: PrismaClient): IncomeSourceRepository {
  return {
    async findAll() {
      const rows = await prisma.incomeSource.findMany({ orderBy: [{ monthId: "asc" }, { order: "asc" }] });
      return rows.map(toEntity);
    },
    async findByMonth(monthId) {
      const rows = await prisma.incomeSource.findMany({ where: { monthId }, orderBy: { order: "asc" } });
      return rows.map(toEntity);
    },
    async findById(id) {
      const row = await prisma.incomeSource.findUnique({ where: { id } });
      return row ? toEntity(row) : null;
    },
    async create(data: CreateIncomeSourceInput) {
      const order =
        data.order ??
        ((await prisma.incomeSource.aggregate({
          where: { monthId: data.monthId },
          _max: { order: true }
        }))._max.order ?? -1) + 1;
      const row = await prisma.incomeSource.create({
        data: {
          ...(data.id ? { id: data.id } : {}),
          monthId: data.monthId,
          name: data.name,
          amount: data.amount,
          order
        }
      });
      return toEntity(row);
    },
    async update(id, patch: UpdateIncomeSourceInput) {
      const row = await prisma.incomeSource.update({ where: { id }, data: patch });
      return toEntity(row);
    },
    async reorder(monthId, orderedIds) {
      await prisma.$transaction(
        orderedIds.map((id, index) =>
          prisma.incomeSource.update({
            where: { id },
            data: { order: index }
          })
        )
      );
    },
    async delete(id) {
      await prisma.incomeSource.delete({ where: { id } });
    }
  };
}
