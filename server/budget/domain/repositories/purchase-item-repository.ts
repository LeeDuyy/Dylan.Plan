import type { PurchaseItemEntity, PurchaseItemStatus } from "../entities/purchase-item";

export type CreatePurchaseItemInput = {
  id?: string;
  monthId: string;
  name: string;
  price?: number | null;
  status?: PurchaseItemStatus;
};

export type UpdatePurchaseItemInput = Partial<Pick<PurchaseItemEntity, "name" | "price" | "status">>;

export interface PurchaseItemRepository {
  findAll(): Promise<PurchaseItemEntity[]>;
  findByMonth(monthId: string): Promise<PurchaseItemEntity[]>;
  findById(id: string): Promise<PurchaseItemEntity | null>;
  create(data: CreatePurchaseItemInput): Promise<PurchaseItemEntity>;
  update(id: string, patch: UpdatePurchaseItemInput): Promise<PurchaseItemEntity>;
  markPurchased(id: string): Promise<PurchaseItemEntity>;
  delete(id: string): Promise<void>;
  transferPendingToMonth(sourceMonthId: string, targetMonthId: string): Promise<number>;
}
