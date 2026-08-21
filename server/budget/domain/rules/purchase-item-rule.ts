import { PURCHASE_ITEM_STATUSES, type PurchaseItemStatus } from "../entities/purchase-item";

export class InvalidPurchaseItemInputError extends Error {}

export function assertValidPurchaseItemName(name: string): void {
  if (!name.trim()) {
    throw new InvalidPurchaseItemInputError("Tên sản phẩm không được để trống.");
  }
}

export function assertValidPurchaseItemPrice(price: number | null | undefined): void {
  if (price == null) return;
  if (!Number.isFinite(price) || price < 0) {
    throw new InvalidPurchaseItemInputError("Giá item phải là số không âm.");
  }
}

export function assertValidPurchaseItemStatus(status: string): asserts status is PurchaseItemStatus {
  if (!PURCHASE_ITEM_STATUSES.includes(status as PurchaseItemStatus)) {
    throw new InvalidPurchaseItemInputError("Trạng thái item không hợp lệ.");
  }
}
