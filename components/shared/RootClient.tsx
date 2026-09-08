"use client";

import type { ReactNode } from "react";
import { Toaster } from "@vn-dylan/ui";

// Mount điểm neo cho toast (toast.push) ở gần gốc app. Không còn ConfigProvider/App
// của antd — design system vn-dylan theming hoàn toàn qua CSS var trong styles.css.
export function RootClient({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
