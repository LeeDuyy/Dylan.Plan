"use client";

import { Drawer } from "@vn-dylan/ui";
import { useDarkMode } from "@vn-dylan/utils";
import {
  BriefcaseBusiness,
  CalendarClock,
  Handshake,
  Menu as MenuIcon,
  Moon,
  PanelsTopLeft,
  ShoppingBag,
  Sun,
  WalletCards
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";

import { UserMenu } from "@/components/shared/UserMenu";

type NavItem = { href: string; label: string; icon: ComponentType<{ size?: number }> };

const navItems: NavItem[] = [
  { href: "/", label: "Tổng quan", icon: PanelsTopLeft },
  { href: "/roadmap", label: "Roadmap", icon: BriefcaseBusiness },
  { href: "/timetable", label: "Thời gian biểu", icon: CalendarClock },
  { href: "/freelance", label: "Freelance", icon: Handshake },
  { href: "/product", label: "Sản phẩm", icon: ShoppingBag },
  { href: "/budget", label: "Thu chi", icon: WalletCards }
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [dark, setMode] = useDarkMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const toggleTheme = () => setMode(dark ? "light" : "dark");
  // `useDarkMode` chỉ biết giá trị thật (localStorage / prefers-color-scheme) sau khi
  // mount ở client — chờ mounted rồi mới chọn icon để khớp SSR, tránh hydration mismatch.
  const themeIcon = !mounted ? <Moon size={18} /> : dark ? <Sun size={18} /> : <Moon size={18} />;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="app-navbar">
        <Link className="brand" href="/">
          <span className="logo">D</span>
          <span>Dylan Plan Dashboard</span>
        </Link>

        <nav className="app-nav-links">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} className={`app-nav-link${isActive(pathname, href) ? " active" : ""}`} href={href}>
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <span className="app-navbar-spacer" />

        <div className="app-navbar-actions">
          <button type="button" className="icon-button" onClick={toggleTheme} title="Đổi giao diện" aria-label="Đổi giao diện">
            {themeIcon}
          </button>
          <UserMenu />
          <button
            type="button"
            className="icon-button app-nav-hamburger"
            onClick={() => setDrawerOpen(true)}
            title="Điều hướng"
            aria-label="Mở menu điều hướng"
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </header>

      <main className="app-content" style={{ flex: 1 }}>
        {children}
      </main>

      <footer className="footer">
        Bắt đầu 22/06/2026 · Chuyển việc · Buy to Build · Mini Shop Builder · Budget cá nhân
      </footer>

      <Drawer isOpen={drawerOpen} placement="right" title="Điều hướng" width={280} onClose={() => setDrawerOpen(false)}>
        <div className="app-nav-drawer">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              className={`app-nav-drawer-link${isActive(pathname, href) ? " active" : ""}`}
              href={href}
              onClick={() => setDrawerOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <button type="button" className="app-nav-drawer-link" onClick={toggleTheme} style={{ width: "100%", cursor: "pointer" }}>
            {themeIcon}
            Đổi giao diện
          </button>
        </div>
      </Drawer>
    </div>
  );
}
