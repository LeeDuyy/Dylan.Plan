import { CATEGORY_TYPES, type CategoryType } from "@/lib/budget-defaults";

export class InvalidCategoryTypeError extends Error {}

export function isValidCategoryType(type: string): type is CategoryType {
  return (CATEGORY_TYPES as readonly string[]).includes(type);
}

export function assertValidCategoryType(type: string): asserts type is CategoryType {
  if (!isValidCategoryType(type)) {
    throw new InvalidCategoryTypeError("Loại danh mục không hợp lệ. Giá trị hợp lệ: Cố định, Tích lũy, Khác.");
  }
}

export function normalizeCategoryType(rawType: string): CategoryType {
  const type = rawType.trim();
  if (type === "Cố định" || type === "Tích lũy") return type;
  return "Khác";
}
