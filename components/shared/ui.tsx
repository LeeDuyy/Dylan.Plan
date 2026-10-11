"use client";

/** Option cho `Select` của @vn-dylan/ui (value + label bắt buộc). */
export type Opt = { label: string; value: string; disabled?: boolean };

export const opt = (value: string, label?: string): Opt => ({ value, label: label ?? value });

/** Đổi giá trị chuỗi hiện tại thành object option mà `Select` cần (hoặc null). */
export function selected(options: Opt[], value: string | null | undefined): Opt | null {
  return options.find((o) => o.value === value) ?? null;
}
