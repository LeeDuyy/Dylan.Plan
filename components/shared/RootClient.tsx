"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Toaster } from "@vn-dylan/ui";

// Mount điểm neo cho toast (toast.push) ở gần gốc app. Không còn ConfigProvider/App
// của antd — design system vn-dylan theming hoàn toàn qua CSS var trong styles.css.
//
// `Toaster` của @vn-dylan/ui gọi useSyncExternalStore với getServerSnapshot là
// `() => []` (mảng mới mỗi lần) → React cảnh báo "The result of getServerSnapshot
// should be cached to avoid an infinite loop". Toast chỉ có ý nghĩa ở client nên
// chỉ mount Toaster sau khi đã hydrate, tránh hoàn toàn nhánh server snapshot.
export function RootClient({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {children}
      {mounted && <Toaster />}
    </>
  );
}
