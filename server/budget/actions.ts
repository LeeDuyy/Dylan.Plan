"use server";

// Composition root cho bounded-context "budget": nối repository (infrastructure,
// Prisma) -> domain service -> application use-case -> Server Action. Route/Client
// Component chỉ được import các hàm export ở đây (application/use-cases), không
// import thẳng domain/infrastructure (R2.4, quy tắc #10 của kit).

import { prisma } from "@/lib/prisma";

import { createGetBudgetSnapshotUseCase } from "./application/use-cases/get-budget-snapshot";
import { createGetMigrationStatusUseCase } from "./application/use-cases/get-migration-status";
import { createMigrateLegacyDataUseCase } from "./application/use-cases/migrate-legacy-data";
import { createRecordQuickTransactionUseCase } from "./application/use-cases/record-quick-transaction";
import { createUpdateTransactionUseCase } from "./application/use-cases/update-transaction";
import { createDeleteTransactionUseCase } from "./application/use-cases/delete-transaction";
import { createUpsertCategoryUseCase } from "./application/use-cases/upsert-category";
import { createRemoveCategoryUseCase } from "./application/use-cases/remove-category";
import { createCreateMonthUseCase } from "./application/use-cases/create-month";
import { createReorderCategoriesUseCase } from "./application/use-cases/reorder-categories";
import { createClearMonthTransactionsUseCase } from "./application/use-cases/clear-month-transactions";
import { createResetAllBudgetDataUseCase } from "./application/use-cases/reset-all-budget-data";
import { createAddPurchaseItemUseCase } from "./application/use-cases/add-purchase-item";
import { createUpdatePurchaseItemUseCase } from "./application/use-cases/update-purchase-item";
import { createMarkPurchaseItemPurchasedUseCase } from "./application/use-cases/mark-purchase-item-purchased";
import { createDeletePurchaseItemUseCase } from "./application/use-cases/delete-purchase-item";

import { createBudgetSnapshotService } from "./domain/services/budget-snapshot-service";
import { createLegacyMigrationService } from "./domain/services/legacy-migration-service";
import { createFallbackCategoryService } from "./domain/services/fallback-category-service";

import { createMonthBudgetPrismaRepository } from "./infrastructure/repositories/month-budget-prisma-repository";
import { createCategoryPrismaRepository } from "./infrastructure/repositories/category-prisma-repository";
import { createTransactionPrismaRepository } from "./infrastructure/repositories/transaction-prisma-repository";
import { createLegacyMigrationPrismaRepository } from "./infrastructure/repositories/legacy-migration-prisma-repository";
import { createPurchaseItemPrismaRepository } from "./infrastructure/repositories/purchase-item-prisma-repository";

import type { BudgetSnapshot } from "./application/use-cases/get-budget-snapshot";
import type { RecordQuickTransactionInput } from "./application/use-cases/record-quick-transaction";
import type { UpdateTransactionInput } from "./application/use-cases/update-transaction";
import type { UpsertCategoryInput } from "./application/use-cases/upsert-category";
import type { RemoveCategoryResult } from "./application/use-cases/remove-category";
import type { CreateMonthInput } from "./application/use-cases/create-month";
import type { ReorderCategoriesInput } from "./application/use-cases/reorder-categories";
import type { AddPurchaseItemInput } from "./application/use-cases/add-purchase-item";
import type { UpdatePurchaseItemUseCaseInput } from "./application/use-cases/update-purchase-item";
import type { LegacyMigrationOutcome, LegacyMigrationPayload } from "./domain/services/legacy-migration-service";
import type { CategoryEntity } from "./domain/entities/category";
import type { TransactionEntity } from "./domain/entities/transaction";
import type { PurchaseItemEntity } from "./domain/entities/purchase-item";
import type { MonthBudgetEntity } from "./domain/entities/month-budget";
import type { LegacyMigrationEntity } from "./domain/entities/legacy-migration";

const monthBudgetRepository = createMonthBudgetPrismaRepository(prisma);
const categoryRepository = createCategoryPrismaRepository(prisma);
const transactionRepository = createTransactionPrismaRepository(prisma);
const legacyMigrationRepository = createLegacyMigrationPrismaRepository(prisma);
const purchaseItemRepository = createPurchaseItemPrismaRepository(prisma);

const budgetSnapshotService = createBudgetSnapshotService({
  monthBudgetRepository,
  categoryRepository,
  transactionRepository,
  purchaseItemRepository
});

const legacyMigrationService = createLegacyMigrationService({
  monthBudgetRepository,
  categoryRepository,
  transactionRepository,
  legacyMigrationRepository
});

const fallbackCategoryService = createFallbackCategoryService({ categoryRepository });

const getBudgetSnapshotUseCase = createGetBudgetSnapshotUseCase(budgetSnapshotService);
const getMigrationStatusUseCase = createGetMigrationStatusUseCase(legacyMigrationRepository);
const migrateLegacyDataUseCase = createMigrateLegacyDataUseCase(legacyMigrationService);
const recordQuickTransactionUseCase = createRecordQuickTransactionUseCase({
  transactionRepository,
  categoryRepository,
  fallbackCategoryService
});
const updateTransactionUseCase = createUpdateTransactionUseCase({
  transactionRepository,
  categoryRepository
});
const deleteTransactionUseCase = createDeleteTransactionUseCase(transactionRepository);
const upsertCategoryUseCase = createUpsertCategoryUseCase(categoryRepository);
const removeCategoryUseCase = createRemoveCategoryUseCase({
  categoryRepository,
  transactionRepository,
  fallbackCategoryService
});
const createMonthUseCase = createCreateMonthUseCase({ monthBudgetRepository, categoryRepository, purchaseItemRepository });
const reorderCategoriesUseCase = createReorderCategoriesUseCase(categoryRepository);
const clearMonthTransactionsUseCase = createClearMonthTransactionsUseCase(transactionRepository);
const resetAllBudgetDataUseCase = createResetAllBudgetDataUseCase({ monthBudgetRepository, categoryRepository });
const addPurchaseItemUseCase = createAddPurchaseItemUseCase(purchaseItemRepository);
const updatePurchaseItemUseCase = createUpdatePurchaseItemUseCase(purchaseItemRepository);
const markPurchaseItemPurchasedUseCase = createMarkPurchaseItemPurchasedUseCase(purchaseItemRepository);
const deletePurchaseItemUseCase = createDeletePurchaseItemUseCase(purchaseItemRepository);

export async function getBudgetSnapshot(): Promise<BudgetSnapshot> {
  return getBudgetSnapshotUseCase();
}

export async function getMigrationStatus(): Promise<LegacyMigrationEntity> {
  return getMigrationStatusUseCase();
}

export async function migrateLegacyData(payload: LegacyMigrationPayload): Promise<LegacyMigrationOutcome> {
  return migrateLegacyDataUseCase(payload);
}

export async function recordQuickTransaction(input: RecordQuickTransactionInput): Promise<TransactionEntity> {
  return recordQuickTransactionUseCase(input);
}

export async function updateTransaction(input: UpdateTransactionInput): Promise<TransactionEntity> {
  return updateTransactionUseCase(input);
}

export async function deleteTransaction(id: string): Promise<void> {
  return deleteTransactionUseCase(id);
}

export async function upsertCategory(input: UpsertCategoryInput): Promise<CategoryEntity> {
  return upsertCategoryUseCase(input);
}

export async function removeCategory(id: string): Promise<RemoveCategoryResult | null> {
  return removeCategoryUseCase(id);
}

export async function createMonth(input: CreateMonthInput): Promise<MonthBudgetEntity> {
  return createMonthUseCase(input);
}

export async function reorderCategories(input: ReorderCategoriesInput): Promise<void> {
  return reorderCategoriesUseCase(input);
}

export async function clearMonthTransactions(monthId: string): Promise<void> {
  return clearMonthTransactionsUseCase(monthId);
}

export async function resetAllBudgetData(): Promise<void> {
  return resetAllBudgetDataUseCase();
}

export async function addPurchaseItem(input: AddPurchaseItemInput): Promise<PurchaseItemEntity> {
  return addPurchaseItemUseCase(input);
}

export async function updatePurchaseItem(input: UpdatePurchaseItemUseCaseInput): Promise<PurchaseItemEntity | null> {
  return updatePurchaseItemUseCase(input);
}

export async function markPurchaseItemPurchased(id: string): Promise<PurchaseItemEntity | null> {
  return markPurchaseItemPurchasedUseCase(id);
}

export async function deletePurchaseItem(id: string): Promise<void> {
  return deletePurchaseItemUseCase(id);
}

// Re-export type-only (bị xoá hoàn toàn khi biên dịch — không vi phạm ràng buộc
// "use server" chỉ được export async function) để Client Component (TB-07/08/09)
// và Server Component (TB-06) dùng chung một nguồn kiểu dữ liệu, tránh lệch contract.
export type {
  BudgetCategorySnapshot,
  MonthBudgetSnapshot,
  PurchaseItemSnapshot,
  TransactionSnapshot
} from "./domain/services/budget-snapshot-service";
export type { BudgetSnapshot } from "./application/use-cases/get-budget-snapshot";
export type { RecordQuickTransactionInput } from "./application/use-cases/record-quick-transaction";
export type { UpdateTransactionExpected, UpdateTransactionInput } from "./application/use-cases/update-transaction";
export type { UpsertCategoryInput } from "./application/use-cases/upsert-category";
export type { RemoveCategoryResult } from "./application/use-cases/remove-category";
export type { CreateMonthInput } from "./application/use-cases/create-month";
export type { ReorderCategoriesInput } from "./application/use-cases/reorder-categories";
export type { AddPurchaseItemInput } from "./application/use-cases/add-purchase-item";
export type { UpdatePurchaseItemUseCaseInput } from "./application/use-cases/update-purchase-item";
export type {
  LegacyCategoryPayload,
  LegacyMigrationOutcome,
  LegacyMigrationPayload,
  LegacyMonthPayload,
  LegacyTransactionPayload
} from "./domain/services/legacy-migration-service";
export type { LegacyMigrationEntity, MigrationStatusValue } from "./domain/entities/legacy-migration";
export type { PurchaseItemEntity, PurchaseItemStatus } from "./domain/entities/purchase-item";
