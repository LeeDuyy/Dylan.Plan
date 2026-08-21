export const PURCHASE_ITEM_STATUSES = ["Pending", "Purchased"] as const;

export type PurchaseItemStatus = (typeof PURCHASE_ITEM_STATUSES)[number];

export type PurchaseItemEntity = {
  id: string;
  monthId: string;
  name: string;
  price: number | null;
  status: PurchaseItemStatus;
};
