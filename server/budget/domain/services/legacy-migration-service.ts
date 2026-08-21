// Domain service: quy trình nghiệp vụ "di trú dữ liệu cũ" (migrateLegacyData) —
// phối hợp MonthBudget + Category + Transaction + LegacyMigration, idempotent theo
// id gốc, chặn chạy song song đa thiết bị (DEC-039, DEC-040, DEC-042). Không import
// Prisma — chỉ phụ thuộc interface repository.

import type { MigrationStatusValue } from "../entities/legacy-migration";
import type { CategoryRepository } from "../repositories/category-repository";
import type { LegacyMigrationRepository } from "../repositories/legacy-migration-repository";
import type { MonthBudgetRepository } from "../repositories/month-budget-repository";
import type { TransactionRepository } from "../repositories/transaction-repository";
import { normalizeCategoryType } from "../rules/category-type-rule";

export type LegacyCategoryPayload = {
  id: string;
  name: string;
  type: string;
  budget: number;
  locked?: boolean;
};

export type LegacyTransactionPayload = {
  id: string;
  text: string;
  amount: number;
  /** Dữ liệu cũ lưu TÊN danh mục tại thời điểm tạo, chưa có categoryId (US-003). */
  category: string;
  createdAt: string;
};

export type LegacyMonthPayload = {
  id: string;
  label?: string;
  income: number;
  categories: LegacyCategoryPayload[];
  transactions: LegacyTransactionPayload[];
};

export type LegacyMigrationPayload = {
  months: LegacyMonthPayload[];
};

export type LegacyMigrationOutcome = {
  status: MigrationStatusValue;
  skipped: boolean;
  reason?: "already-completed" | "in-progress-elsewhere";
  errorMessage?: string;
};

export type LegacyMigrationServiceDeps = {
  monthBudgetRepository: MonthBudgetRepository;
  categoryRepository: CategoryRepository;
  transactionRepository: TransactionRepository;
  legacyMigrationRepository: LegacyMigrationRepository;
};

function formatMonthLabel(id: string): string {
  const [year, month] = id.split("-");
  const numericMonth = Number(month);
  return Number.isFinite(numericMonth) && year ? `Tháng ${numericMonth}/${year}` : id;
}

export function createLegacyMigrationService(deps: LegacyMigrationServiceDeps) {
  return {
    async migrate(payload: LegacyMigrationPayload): Promise<LegacyMigrationOutcome> {
      const current = await deps.legacyMigrationRepository.getStatus();
      if (current.status === "Completed") {
        return { status: "Completed", skipped: true, reason: "already-completed" };
      }

      const claimed = await deps.legacyMigrationRepository.claimInProgress();
      if (!claimed) {
        // Thiết bị khác đang giữ trạng thái InProgress — chỉ chờ, không chạy song song (DEC-040).
        return { status: "InProgress", skipped: true, reason: "in-progress-elsewhere" };
      }

      try {
        for (const month of payload.months) {
          await deps.monthBudgetRepository.upsert({
            id: month.id,
            label: month.label ?? formatMonthLabel(month.id),
            income: month.income
          });

          const categoryIdByName = new Map<string, string>();
          for (const [categoryIndex, category] of month.categories.entries()) {
            const saved = await deps.categoryRepository.upsert({
              id: category.id,
              monthId: month.id,
              name: category.name,
              type: normalizeCategoryType(category.type),
              budget: category.budget,
              locked: Boolean(category.locked),
              // Dữ liệu di trú từ localStorage không có khái niệm "Chi tiêu khác" (US-005 mới thêm sau US-001).
              isFallback: false,
              order: categoryIndex
            });
            categoryIdByName.set(category.name, saved.id);
          }

          for (const tx of month.transactions) {
            const categoryId = categoryIdByName.get(tx.category);
            if (!categoryId) {
              throw new Error(
                `Không tìm thấy danh mục "${tx.category}" cho giao dịch "${tx.text}" của tháng ${month.id} khi di trú.`
              );
            }
            await deps.transactionRepository.upsert({
              id: tx.id,
              monthId: month.id,
              categoryId,
              text: tx.text,
              amount: tx.amount,
              createdAt: new Date(tx.createdAt)
            });
          }
        }

        await deps.legacyMigrationRepository.markCompleted();
        return { status: "Completed", skipped: false };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Di trú thất bại không rõ nguyên nhân.";
        await deps.legacyMigrationRepository.markFailed(message);
        // Không throw tiếp: trạng thái Failed cho phép lần mở kế tiếp tự thử lại (DEC-039)
        // mà không làm crash toàn trang.
        return { status: "Failed", skipped: false, errorMessage: message };
      }
    }
  };
}

export type LegacyMigrationService = ReturnType<typeof createLegacyMigrationService>;
