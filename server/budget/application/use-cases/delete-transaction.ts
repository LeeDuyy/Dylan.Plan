import { revalidatePath } from "next/cache";

import type { TransactionRepository } from "../../domain/repositories/transaction-repository";

export function createDeleteTransactionUseCase(repository: TransactionRepository) {
  return async function deleteTransaction(id: string): Promise<void> {
    const transaction = await repository.findById(id);
    if (!transaction) return; // Đã không còn — coi như đã xóa, idempotent (giống removeCategory).
    await repository.delete(id);
    revalidatePath("/budget");
  };
}
