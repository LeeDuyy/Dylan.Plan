import { revalidatePath } from "next/cache";

import type { TransactionEntity } from "../../domain/entities/transaction";
import { assertTransactionDateNotInFuture, assertValidTransactionAmount } from "../../domain/rules/transaction-input-rule";
import type { CategoryRepository } from "../../domain/repositories/category-repository";
import type { TransactionRepository } from "../../domain/repositories/transaction-repository";
import type { FallbackCategoryService } from "../../domain/services/fallback-category-service";

export type RecordQuickTransactionInput = {
  monthId: string;
  /** Bỏ trống khi Dylan không chọn danh mục — tự vào "Chi tiêu khác" (DEC-028/DEC-055). */
  categoryId?: string;
  text: string;
  amount: number;
  /** ISO string, mặc định là thời điểm hiện tại nếu không truyền. */
  createdAt?: string;
};

export class RecordQuickTransactionError extends Error {}

export type RecordQuickTransactionDeps = {
  transactionRepository: TransactionRepository;
  categoryRepository: CategoryRepository;
  fallbackCategoryService: FallbackCategoryService;
};

export function createRecordQuickTransactionUseCase(deps: RecordQuickTransactionDeps) {
  return async function recordQuickTransaction(input: RecordQuickTransactionInput): Promise<TransactionEntity> {
    const text = input.text.trim();
    if (!text) {
      throw new RecordQuickTransactionError("Nội dung giao dịch không được để trống.");
    }

    // Validate server-side dù UI đã validate (R2 / hướng dẫn bắt buộc).
    assertValidTransactionAmount(input.amount);

    const createdAt = input.createdAt ? new Date(input.createdAt) : new Date();
    if (Number.isNaN(createdAt.getTime())) {
      throw new RecordQuickTransactionError("Ngày giao dịch không hợp lệ.");
    }
    assertTransactionDateNotInFuture(createdAt);

    const requestedCategoryId = input.categoryId?.trim();
    let categoryId: string;
    if (requestedCategoryId) {
      const category = await deps.categoryRepository.findById(requestedCategoryId);
      if (!category || category.monthId !== input.monthId) {
        throw new RecordQuickTransactionError("Danh mục không thuộc tháng đang chọn.");
      }
      categoryId = requestedCategoryId;
    } else {
      const fallback = await deps.fallbackCategoryService.getOrCreate(input.monthId);
      categoryId = fallback.id;
    }

    const created = await deps.transactionRepository.create({
      monthId: input.monthId,
      categoryId,
      text,
      amount: input.amount,
      createdAt
    });

    revalidatePath("/budget");
    return created;
  };
}
