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

  const navLinks = (variant: "side" | "drawer") =>
    navItems.map(({ href, label, icon: Icon }) => (
      <Link
        key={href}
        className={`app-nav-link app-nav-link--${variant}${isActive(pathname, href) ? " active" : ""}`}
        href={href}
        onClick={variant === "drawer" ? () => setDrawerOpen(false) : undefined}
      >
        <Icon size={variant === "drawer" ? 18 : 17} />
        {label}
      </Link>
    ));

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link className="brand app-sidebar-brand" href="/">
          <span className="logo">D</span>
          <span>Dylan Plan</span>
        </Link>

        <nav className="app-sidebar-nav">{navLinks("side")}</nav>

        <div className="app-sidebar-foot">
          <button
            type="button"
            className="app-nav-link app-nav-link--side"
            onClick={toggleTheme}
            style={{ width: "100%", cursor: "pointer" }}
          >
            {themeIcon}
            {mounted && dark ? "Giao diện sáng" : "Giao diện tối"}
          </button>
          <UserMenu />
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <button
            type="button"
            className="icon-button"
            onClick={() => setDrawerOpen(true)}
            title="Điều hướng"
            aria-label="Mở menu điều hướng"
          >
            <MenuIcon size={20} />
          </button>
          <Link className="brand" href="/">
            <span className="logo">D</span>
            <span>Dylan Plan</span>
          </Link>
          <span style={{ flex: 1 }} />
          <button type="button" className="icon-button" onClick={toggleTheme} title="Đổi giao diện" aria-label="Đổi giao diện">
            {themeIcon}
          </button>
        </header>

        <main className="app-content">{children}</main>

        <footer className="footer">
          Bắt đầu 22/06/2026 · Chuyển việc · Buy to Build · Mini Shop Builder · Budget cá nhân
        </footer>
      </div>

      <Drawer isOpen={drawerOpen} placement="left" title="Dylan Plan" width={264} onClose={() => setDrawerOpen(false)}>
        <div className="app-nav-drawer">
          {navLinks("drawer")}
          <button
            type="button"
            className="app-nav-link app-nav-link--drawer"
            onClick={toggleTheme}
            style={{ width: "100%", cursor: "pointer" }}
          >
            {themeIcon}
            {mounted && dark ? "Giao diện sáng" : "Giao diện tối"}
          </button>
        </div>
      </Drawer>
    </div>
  );
}
