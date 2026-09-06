"use client";

import { BriefcaseBusiness, CalendarClock, Handshake, Moon, PanelsTopLeft, ShoppingBag, Sun, WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { UserMenu } from "@/components/shared/UserMenu";

const STORAGE_KEY = "dylan-plan-next-dashboard-v2";

const navItems: [string, string, typeof PanelsTopLeft, string][] = [
  ["overview", "Tổng quan", PanelsTopLeft, "/"],
  ["roadmap", "Roadmap", BriefcaseBusiness, "/roadmap"],
  ["timetable", "Thời gian biểu", CalendarClock, "/timetable"],
  ["freelance", "Freelance", Handshake, "/freelance"],
  ["product", "Sản phẩm", ShoppingBag, "/product"]
];

// Khung chung cho mọi route của Dylan Plan (trừ /budget vốn là một mini-app riêng):
// topbar + thanh chuyển khu vực + footer + trạng thái sáng/tối. Mỗi route chỉ truyền
// nội dung khu vực của mình vào `children`.
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Đọc/ghi `dark` từ localStorage — dùng chung khoá với /budget (BudgetApp) nhưng
  // không chia sẻ React state qua route.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { dark?: boolean };
        setDark(Boolean(parsed.dark));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ dark }));
    }
  }, [dark, hydrated]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav">
          <Link className="brand" href="/">
            <span className="logo">D</span>
            <span>Dylan Plan Dashboard</span>
          </Link>
          <div className="nav-actions">
            <nav className="nav-tabs" aria-label="Chuyển khu vực">
              {navItems.map(([tab, label, Icon, href]) => (
                <Link className={`tab-button ${pathname === href ? "active" : ""}`} href={href} key={tab}>
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              <Link className={`tab-button ${pathname === "/budget" ? "active" : ""}`} href="/budget">
                <WalletCards size={16} />
                Thu chi
              </Link>
            </nav>
            <button className="icon-button" onClick={() => setDark((value) => !value)} title="Đổi giao diện" type="button">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main id="top">{children}</main>

      <footer className="footer">
        <div className="container">Bắt đầu 22/06/2026 · Chuyển việc · Buy to Build · Mini Shop Builder · Budget cá nhân</div>
      </footer>
    </div>
  );
}
