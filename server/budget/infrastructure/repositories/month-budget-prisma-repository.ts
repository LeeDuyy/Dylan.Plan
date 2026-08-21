import type { PrismaClient } from "@/generated/prisma/client";

import type { MonthBudgetEntity } from "../../domain/entities/month-budget";
import type { MonthBudgetRepository } from "../../domain/repositories/month-budget-repository";

type MonthBudgetRow = { id: string; label: string; income: number };

function toEntity(row: MonthBudgetRow): MonthBudgetEntity {
  return { id: row.id, label: row.label, income: row.income };
}

export function createMonthBudgetPrismaRepository(prisma: PrismaClient): MonthBudgetRepository {
  return {
    async findAll() {
      const rows = await prisma.monthBudget.findMany();
      return rows.map(toEntity);
    },
    async findById(id) {
      const row = await prisma.monthBudget.findUnique({ where: { id } });
      return row ? toEntity(row) : null;
    },
    async create(data) {
      const row = await prisma.monthBudget.create({
        data: { id: data.id, label: data.label, income: data.income }
      });
      return toEntity(row);
    },
    async upsert(data) {
      const row = await prisma.monthBudget.upsert({
        where: { id: data.id },
        create: { id: data.id, label: data.label, income: data.income },
        update: { label: data.label, income: data.income }
      });
      return toEntity(row);
    },
    async deleteAll() {
      // Category/Transaction có onDelete: Cascade từ MonthBudget nên tự dọn theo.
      await prisma.monthBudget.deleteMany();
    }
  };
}
