"use client";

import { useCallback, useEffect, useState } from "react";

export type Density = "compact" | "comfortable" | "spacious";

export const DENSITY_STORAGE_KEY = "dylan-plan-density";
const DENSITIES: Density[] = ["compact", "comfortable", "spacious"];

function readStored(): Density {
  if (typeof window === "undefined") return "comfortable";
  try {
    const value = window.localStorage.getItem(DENSITY_STORAGE_KEY);
    return DENSITIES.includes(value as Density) ? (value as Density) : "comfortable";
  } catch {
    return "comfortable";
  }
}

function applyDensity(density: Density) {
  const root = document.documentElement;
  // `comfortable` là mặc định của :root → gỡ attr thay vì set, để CSS gọn.
  if (density === "comfortable") root.removeAttribute("data-density");
  else root.dataset.density = density;
}

// Mirror `useDarkMode` (@vn-dylan/utils): lưu localStorage + set attribute trên <html>.
// Init script trong app/layout.tsx đã đặt attr trước hydrate nên không nháy giao diện.
export function useDensity(): [Density, (next: Density) => void] {
  // Server luôn render "comfortable" (không đọc được localStorage) → state khởi tạo khớp.
  const [density, setDensityState] = useState<Density>("comfortable");

  useEffect(() => {
    const stored = readStored();
    setDensityState(stored);
    applyDensity(stored);
  }, []);

  const setDensity = useCallback((next: Density) => {
    setDensityState(next);
    applyDensity(next);
    try {
      window.localStorage.setItem(DENSITY_STORAGE_KEY, next);
    } catch {
      /* localStorage không khả dụng — bỏ qua, attr vẫn được áp trong phiên này */
    }
  }, []);

  return [density, setDensity];
}
