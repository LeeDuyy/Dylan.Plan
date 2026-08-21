import { revalidatePath } from "next/cache";

import type { TransactionEntity } from "../../domain/entities/transaction";
import { assertTransactionDateNotInFuture, assertValidTransactionAmount } from "../../domain/rules/transaction-input-rule";
import type { CategoryRepository } from "../../domain/repositories/category-repository";
import type { TransactionRepository } from "../../domain/repositories/transaction-repository";

/** Giá trị client đã tải lần gần nhất trước khi vào chế độ sửa — dùng để phát hiện
 * xung đột sửa đồng thời (DEC-048) bằng cách so khớp toàn bộ giá trị, không cần cột
 * `updatedAt`/version. */
export type UpdateTransactionExpected = {
  text: string;
  amount: number;
  categoryId: string;
  /** ISO string. */
  createdAt: string;
};

export type UpdateTransactionInput = {
  id: string;
  monthId: string;
  categoryId: string;
  text: string;
  amount: number;
  /** ISO string, giá trị mới muốn lưu. */
  createdAt: string;
  expected: UpdateTransactionExpected;
};

export class UpdateTransactionError extends Error {}
export class UpdateTransactionConflictError extends UpdateTransactionError {}

export type UpdateTransactionDeps = {
  transactionRepository: TransactionRepository;
  categoryRepository: CategoryRepository;
};

export function createUpdateTransactionUseCase(deps: UpdateTransactionDeps) {
  return async function updateTransaction(input: UpdateTransactionInput): Promise<TransactionEntity> {
    const text = input.text.trim();
    if (!text) {
      throw new UpdateTransactionError("Nội dung giao dịch không được để trống.");
    }

    // Validate server-side dù UI đã validate (R2 / hướng dẫn bắt buộc).
    assertValidTransactionAmount(input.amount);

    const createdAt = new Date(input.createdAt);
    if (Number.isNaN(createdAt.getTime())) {
      throw new UpdateTransactionError("Ngày giao dịch không hợp lệ.");
    }
    assertTransactionDateNotInFuture(createdAt);

    const category = await deps.categoryRepository.findById(input.categoryId);
    if (!category || category.monthId !== input.monthId) {
      throw new UpdateTransactionError("Danh mục không thuộc tháng đang chọn.");
    }

    const current = await deps.transactionRepository.findById(input.id);
    const expected = input.expected;
    const conflicted =
      !current ||
      current.text !== expected.text ||
      current.amount !== expected.amount ||
      current.categoryId !== expected.categoryId ||
      current.createdAt.toISOString() !== expected.createdAt;
    if (conflicted) {
      throw new UpdateTransactionConflictError(
        "Giao dịch này vừa được thay đổi ở nơi khác, hãy tải lại để xem bản mới nhất."
      );
    }

    const updated = await deps.transactionRepository.update(input.id, {
      text,
      amount: input.amount,
      categoryId: input.categoryId,
      createdAt
    });

    revalidatePath("/budget");
    return updated;
  };
}
