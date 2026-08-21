import type { PrismaClient } from "@/generated/prisma/client";

import type { TransactionEntity } from "../../domain/entities/transaction";
import type {
  CreateTransactionInput,
  TransactionRepository,
  UpdateTransactionInput
} from "../../domain/repositories/transaction-repository";

type TransactionRow = {
  id: string;
  monthId: string;
  categoryId: string;
  text: string;
  amount: number;
  createdAt: Date;
};

function toEntity(row: TransactionRow): TransactionEntity {
  return {
    id: row.id,
    monthId: row.monthId,
    categoryId: row.categoryId,
    text: row.text,
    amount: row.amount,
    createdAt: row.createdAt
  };
}

export function createTransactionPrismaRepository(prisma: PrismaClient): TransactionRepository {
  return {
    async findAll() {
      const rows = await prisma.transaction.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map(toEntity);
    },
    async findByMonth(monthId) {
      const rows = await prisma.transaction.findMany({ where: { monthId }, orderBy: { createdAt: "desc" } });
      return rows.map(toEntity);
    },
    async findById(id) {
      const row = await prisma.transaction.findUnique({ where: { id } });
      return row ? toEntity(row) : null;
    },
    async sumAmountGroupedByCategory() {
      const grouped = await prisma.transaction.groupBy({
        by: ["categoryId"],
        _sum: { amount: true }
      });
      const result: Record<string, number> = {};
      for (const row of grouped) {
        result[row.categoryId] = row._sum.amount ?? 0;
      }
      return result;
    },
    async countByCategory(categoryId) {
      return prisma.transaction.count({ where: { categoryId } });
    },
    async reassignCategory(fromCategoryId, toCategoryId) {
      const result = await prisma.transaction.updateMany({
        where: { categoryId: fromCategoryId },
        data: { categoryId: toCategoryId }
      });
      return result.count;
    },
    async create(data: CreateTransactionInput) {
      const row = await prisma.transaction.create({
        data: {
          ...(data.id ? { id: data.id } : {}),
          monthId: data.monthId,
          categoryId: data.categoryId,
          text: data.text,
          amount: data.amount,
          ...(data.createdAt ? { createdAt: data.createdAt } : {})
        }
      });
      return toEntity(row);
    },
    async upsert(data) {
      const row = await prisma.transaction.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          monthId: data.monthId,
          categoryId: data.categoryId,
          text: data.text,
          amount: data.amount,
          createdAt: data.createdAt
        },
        update: {
          monthId: data.monthId,
          categoryId: data.categoryId,
          text: data.text,
          amount: data.amount,
          createdAt: data.createdAt
        }
      });
      return toEntity(row);
    },
    async update(id, patch: UpdateTransactionInput) {
      const row = await prisma.transaction.update({ where: { id }, data: patch });
      return toEntity(row);
    },
    async delete(id) {
      await prisma.transaction.delete({ where: { id } });
    },
    async deleteManyByMonth(monthId) {
      await prisma.transaction.deleteMany({ where: { monthId } });
    }
  };
}
