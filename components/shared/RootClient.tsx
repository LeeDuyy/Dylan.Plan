"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LocaleProvider, Toaster } from "@vn-dylan/ui";

// Bọc toàn app: `LocaleProvider locale="vi"` dịch chuỗi có sẵn của component (Đóng, Hủy,
// phân trang...). Không còn ConfigProvider/App của antd — design system vn-dylan theming
// hoàn toàn qua CSS var trong styles.css.
//
// Giữ component bọc app không có state (không re-render trong lúc app đang hydrate);
// phần cần state (Toaster) tách sang `ToasterMount`, render cạnh app chứ không bọc app.
export function RootClient({ children }: { children: ReactNode }) {
  return <LocaleProvider locale="vi">{children}</LocaleProvider>;
}

// Mount điểm neo cho toast (toast.push). `Toaster` của @vn-dylan/ui gọi
// useSyncExternalStore với getServerSnapshot là `() => []` (mảng mới mỗi lần) → React
// cảnh báo "The result of getServerSnapshot should be cached to avoid an infinite loop".
// Toast chỉ có ý nghĩa ở client nên chỉ mount Toaster sau khi đã hydrate.
export function ToasterMount() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return mounted ? (
    <LocaleProvider locale="vi">
      <Toaster />
    </LocaleProvider>
  ) : null;
}
