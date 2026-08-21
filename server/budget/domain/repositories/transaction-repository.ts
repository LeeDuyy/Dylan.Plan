import type { TransactionEntity } from "../entities/transaction";

export type CreateTransactionInput = {
  id?: string;
  monthId: string;
  categoryId: string;
  text: string;
  amount: number;
  createdAt?: Date;
};

export type UpdateTransactionInput = Partial<Pick<TransactionEntity, "text" | "amount" | "categoryId" | "createdAt">>;

export interface TransactionRepository {
  findAll(): Promise<TransactionEntity[]>;
  findByMonth(monthId: string): Promise<TransactionEntity[]>;
  findById(id: string): Promise<TransactionEntity | null>;
  /** Tổng `amount` gộp theo `categoryId` trên toàn bộ giao dịch (1 truy vấn, tránh N+1). */
  sumAmountGroupedByCategory(): Promise<Record<string, number>>;
  /** Số giao dịch đang gán vào một danh mục — dùng để quyết định có cần chuyển sang "Chi tiêu khác" khi xóa danh mục không. */
  countByCategory(categoryId: string): Promise<number>;
  /** Chuyển toàn bộ giao dịch từ một danh mục sang danh mục khác (BR-008); trả về số giao dịch đã chuyển. */
  reassignCategory(fromCategoryId: string, toCategoryId: string): Promise<number>;
  create(data: CreateTransactionInput): Promise<TransactionEntity>;
  upsert(data: TransactionEntity): Promise<TransactionEntity>;
  update(id: string, patch: UpdateTransactionInput): Promise<TransactionEntity>;
  delete(id: string): Promise<void>;
  deleteManyByMonth(monthId: string): Promise<void>;
}
