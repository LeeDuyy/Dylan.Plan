import type { PrismaClient } from "@/generated/prisma/client";

import type { PurchaseItemEntity, PurchaseItemStatus } from "../../domain/entities/purchase-item";
import type {
  CreatePurchaseItemInput,
  PurchaseItemRepository,
  UpdatePurchaseItemInput
} from "../../domain/repositories/purchase-item-repository";
import { assertValidPurchaseItemStatus } from "../../domain/rules/purchase-item-rule";

type PurchaseItemRow = {
  id: string;
  monthId: string;
  name: string;
  price: number | null;
  status: string;
};

function toEntity(row: PurchaseItemRow): PurchaseItemEntity {
  assertValidPurchaseItemStatus(row.status);
  return {
    id: row.id,
    monthId: row.monthId,
    name: row.name,
    price: row.price,
    status: row.status
  };
}

export function createPurchaseItemPrismaRepository(prisma: PrismaClient): PurchaseItemRepository {
  return {
    async findAll() {
      const rows = await prisma.purchaseItem.findMany({ orderBy: [{ monthId: "asc" }, { createdAt: "asc" }, { id: "asc" }] });
      return rows.map(toEntity);
    },
    async findByMonth(monthId) {
      const rows = await prisma.purchaseItem.findMany({ where: { monthId }, orderBy: [{ createdAt: "asc" }, { id: "asc" }] });
      return rows.map(toEntity);
    },
    async findById(id) {
      const row = await prisma.purchaseItem.findUnique({ where: { id } });
      return row ? toEntity(row) : null;
    },
    async create(data: CreatePurchaseItemInput) {
      const row = await prisma.purchaseItem.create({
        data: {
          ...(data.id ? { id: data.id } : {}),
          monthId: data.monthId,
          name: data.name,
          price: data.price ?? null,
          status: data.status ?? "Pending"
        }
      });
      return toEntity(row);
    },
    async update(id, patch: UpdatePurchaseItemInput) {
      const row = await prisma.purchaseItem.update({ where: { id }, data: patch });
      return toEntity(row);
    },
    async markPurchased(id) {
      const row = await prisma.purchaseItem.update({ where: { id }, data: { status: "Purchased" satisfies PurchaseItemStatus } });
      return toEntity(row);
    },
    async delete(id) {
      await prisma.purchaseItem.delete({ where: { id } });
    },
    async transferPendingToMonth(sourceMonthId, targetMonthId) {
      if (sourceMonthId === targetMonthId) return 0;
      const result = await prisma.purchaseItem.updateMany({
        where: { monthId: sourceMonthId, status: "Pending" },
        data: { monthId: targetMonthId }
      });
      return result.count;
    }
  };
}
