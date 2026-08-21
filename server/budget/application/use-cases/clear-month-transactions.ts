import { revalidatePath } from "next/cache";

import type { TransactionRepository } from "../../domain/repositories/transaction-repository";

// CRUD thuần (xoá toàn bộ Transaction của 1 tháng) — không có rule nghiệp vụ đặc
// biệt, gọi thẳng repository, không cần domain service.
export function createClearMonthTransactionsUseCase(repository: TransactionRepository) {
  return async function clearMonthTransactions(monthId: string): Promise<void> {
    await repository.deleteManyByMonth(monthId);
    revalidatePath("/budget");
  };
}
