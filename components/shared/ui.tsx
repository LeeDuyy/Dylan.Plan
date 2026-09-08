"use client";

import { Button } from "@vn-dylan/ui";
import type { ReactNode } from "react";

/** Option cho `Select` của @vn-dylan/ui (value + label bắt buộc). */
export type Opt = { label: string; value: string; disabled?: boolean };

export const opt = (value: string, label?: string): Opt => ({ value, label: label ?? value });

/** Đổi giá trị chuỗi hiện tại thành object option mà `Select` cần (hoặc null). */
export function selected(options: Opt[], value: string | null | undefined): Opt | null {
  return options.find((o) => o.value === value) ?? null;
}

/**
 * Xác nhận tại chỗ thay cho `Popconfirm` của antd: hiện 2 nút "xác nhận / hủy"
 * ngay vị trí nút gốc. Trạng thái mở do phía gọi giữ.
 */
export function InlineConfirm({
  open,
  label,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  disabled,
  onOpen,
  onConfirm,
  onCancel,
  trigger
}: {
  open: boolean;
  label: string;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  onOpen: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  trigger: ReactNode;
}) {
  if (!open) {
    return (
      <span onClick={onOpen} style={{ display: "inline-flex" }}>
        {trigger}
      </span>
    );
  }
  return (
    <span className="job-confirm-delete">
      <span>{label}</span>
      <Button size="sm" className="btn-danger btn-danger-strong" disabled={disabled} onClick={onConfirm}>
        {confirmText}
      </Button>
      <Button size="sm" variant="plain" disabled={disabled} onClick={onCancel}>
        {cancelText}
      </Button>
    </span>
  );
}
