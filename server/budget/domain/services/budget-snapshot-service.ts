// Domain service: phối hợp MonthBudget + Category + Transaction để dựng "Chi thực tế"
// (aggregate Transaction theo Category, DEC-007/BR-01) và toàn bộ snapshot ngân sách
// đọc được cho UI. Không import Prisma — chỉ phụ thuộc interface repository.

import type { CategoryRepository } from "../repositories/category-repository";
import type { MonthBudgetRepository } from "../repositories/month-budget-repository";
import type { PurchaseItemRepository } from "../repositories/purchase-item-repository";
import type { TransactionRepository } from "../repositories/transaction-repository";

export type BudgetCategorySnapshot = {
  id: string;
  name: string;
  type: string;
  budget: number;
  /** Luôn tính từ `aggregate` trên Transaction — không có ô nhập tay (EL-06). */
  actual: number;
  locked: boolean;
  /** Danh mục dự phòng "Chi tiêu khác" — UI ẩn khỏi bảng khi `actual === 0` (BR-012) và hiển thị chỉ đọc khi có giao dịch (BR-010). */
  isFallback: boolean;
};

export type TransactionSnapshot = {
  id: string;
  text: string;
  amount: number;
  categoryId: string;
  createdAt: string;
};

export type PurchaseItemSnapshot = {
  id: string;
  name: string;
  price: number | null;
  status: "Pending" | "Purchased";
};

export type MonthBudgetSnapshot = {
  id: string;
  label: string;
  income: number;
  categories: BudgetCategorySnapshot[];
  transactions: TransactionSnapshot[];
  purchaseItems: PurchaseItemSnapshot[];
};

export type BudgetSnapshot = {
  months: MonthBudgetSnapshot[];
};

export type BudgetSnapshotServiceDeps = {
  monthBudgetRepository: MonthBudgetRepository;
  categoryRepository: CategoryRepository;
  transactionRepository: TransactionRepository;
  purchaseItemRepository: PurchaseItemRepository;
};

export function createBudgetSnapshotService(deps: BudgetSnapshotServiceDeps) {
  return {
    async getSnapshot(): Promise<BudgetSnapshot> {
      const [months, categories, transactions, purchaseItems, actualByCategory] = await Promise.all([
        deps.monthBudgetRepository.findAll(),
        deps.categoryRepository.findAll(),
        deps.transactionRepository.findAll(),
        deps.purchaseItemRepository.findAll(),
        deps.transactionRepository.sumAmountGroupedByCategory()
      ]);

      const categoriesByMonth = new Map<string, BudgetCategorySnapshot[]>();
      for (const category of categories) {
        const list = categoriesByMonth.get(category.monthId) ?? [];
        list.push({
          id: category.id,
          name: category.name,
          type: category.type,
          budget: category.budget,
          locked: category.locked,
          isFallback: category.isFallback,
          actual: actualByCategory[category.id] ?? 0
        });
        categoriesByMonth.set(category.monthId, list);
      }

      const transactionsByMonth = new Map<string, TransactionSnapshot[]>();
      for (const tx of transactions) {
        const list = transactionsByMonth.get(tx.monthId) ?? [];
        list.push({
          id: tx.id,
          text: tx.text,
          amount: tx.amount,
          categoryId: tx.categoryId,
          createdAt: tx.createdAt.toISOString()
        });
        transactionsByMonth.set(tx.monthId, list);
      }

      const purchaseItemsByMonth = new Map<string, PurchaseItemSnapshot[]>();
      for (const item of purchaseItems) {
        const list = purchaseItemsByMonth.get(item.monthId) ?? [];
        list.push({
          id: item.id,
          name: item.name,
          price: item.price,
          status: item.status
        });
        purchaseItemsByMonth.set(item.monthId, list);
      }

      const monthSnapshots = months
        .map((month) => ({
          id: month.id,
          label: month.label,
          income: month.income,
          categories: categoriesByMonth.get(month.id) ?? [],
          transactions: (transactionsByMonth.get(month.id) ?? []).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
          purchaseItems: purchaseItemsByMonth.get(month.id) ?? []
        }))
        .sort((a, b) => a.id.localeCompare(b.id));

      return { months: monthSnapshots };
    }
  };
}

export type BudgetSnapshotService = ReturnType<typeof createBudgetSnapshotService>;
