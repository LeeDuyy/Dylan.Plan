"use client";

import { Drawer } from "@vn-dylan/ui";
import { useDarkMode } from "@vn-dylan/utils";
import { ChevronDown, LogOut, Menu as MenuIcon, Moon, Settings2, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { ConfigDrawer } from "@/components/shared/ConfigDrawer";
import { useUserEmail } from "@/components/shared/UserSessionContext";
import { activeGroup, applyNavPrefs, currentMeta, navGroups } from "@/components/shared/nav";
import type { NavPref } from "@/lib/nav-registry";
import type { RoadmapPhaseView } from "@/lib/roadmap-defaults";
import type { TimetableRowView } from "@/lib/timetable-defaults";
import { signOutAction } from "@/server/auth/actions";

export function AppShell({
  children,
  navPrefs,
  roadmapPhases,
  timetableRows
}: {
  children: ReactNode;
  navPrefs: NavPref[];
  roadmapPhases: RoadmapPhaseView[];
  timetableRows: TimetableRowView[];
}) {
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "/";
  const email = useUserEmail();
  const [dark, setMode] = useDarkMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Cây nav sau khi áp thứ tự + ẩn/hiện từ DB (NavPref).
  const groups = useMemo(() => applyNavPrefs(navGroups, navPrefs), [navPrefs]);

  const [expanded, setExpanded] = useState<string | null>(() => {
    const current = activeGroup(pathname, groups);
    return current ? current.label : null;
  });

  useEffect(() => setMounted(true), []);

  // Chọn menu (đổi route) → chỉ mục cha chứa route hiện tại được mở, các mục
  // khác tự đóng lại (accordion) — kể cả khi người dùng vừa bấm mở mục khác.
  useEffect(() => {
    const current = activeGroup(pathname, groups);
    setExpanded(current ? current.label : null);
  }, [pathname, groups]);

  const meta = currentMeta(pathname);
  const toggleTheme = () => setMode(dark ? "light" : "dark");
  // Bấm vào mục cha đang đóng → mở nó và đóng mục khác; bấm mục đang mở → đóng lại.
  const toggleGroup = (label: string) => setExpanded((prev) => (prev === label ? null : label));

  // `useDarkMode` chỉ biết giá trị thật (localStorage / prefers-color-scheme) sau khi
  // mount ở client — chờ mounted rồi mới chọn icon để khớp SSR, tránh hydration mismatch.
  const themeIcon = !mounted ? <Moon size={18} /> : dark ? <Sun size={18} /> : <Moon size={18} />;

  const navTree = (variant: "side" | "drawer") => {
    const iconSize = variant === "drawer" ? 18 : 17;
    const closeDrawer = variant === "drawer" ? () => setDrawerOpen(false) : undefined;

    return groups.map((group) => {
      const Icon = group.icon;
      const groupActive = group.match(pathname);

      if (group.children.length === 0) {
        return (
          <Link
            key={group.label}
            className={`app-nav-link app-nav-link--${variant}${groupActive ? " active" : ""}`}
            href={group.href}
            onClick={closeDrawer}
          >
            <Icon size={iconSize} />
            {group.label}
          </Link>
        );
      }

      const open = expanded === group.label;

      return (
        <div className="app-nav-group" key={group.label}>
          <button
            type="button"
            className={`app-nav-link app-nav-link--${variant} app-nav-group-toggle${groupActive ? " active" : ""}`}
            aria-expanded={open}
            onClick={() => toggleGroup(group.label)}
          >
            <Icon size={iconSize} />
            <span className="app-nav-group-label">{group.label}</span>
            <ChevronDown size={15} className={`app-nav-chevron${open ? " open" : ""}`} />
          </button>
          {open && (
            <div className="app-nav-sublist">
              {group.children.map((child) => (
                <Link
                  key={child.href}
                  className={`app-nav-sublink${pathname === child.href ? " active" : ""}`}
                  href={child.href}
                  onClick={closeDrawer}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link className="brand app-sidebar-brand" href="/">
          <span className="logo">D</span>
          <span>Dylan Plan</span>
        </Link>

        <nav className="app-sidebar-nav">{navTree("side")}</nav>

        <div className="app-sidebar-foot">
          {email && (
            <span className="app-sidebar-user" title={email}>
              {email}
            </span>
          )}
          <form action={signOutAction}>
            <button type="submit" className="app-nav-link app-nav-link--side" style={{ width: "100%", cursor: "pointer" }}>
              <LogOut size={17} />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <button
            type="button"
            className="icon-button app-topbar-menu"
            onClick={() => setDrawerOpen(true)}
            title="Điều hướng"
            aria-label="Mở menu điều hướng"
          >
            <MenuIcon size={20} />
          </button>
          <div className="app-topbar-heading">
            <span className="app-topbar-title">{meta.title}</span>
            {meta.desc && <span className="app-topbar-desc">{meta.desc}</span>}
          </div>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            className="icon-button"
            onClick={() => setConfigOpen(true)}
            title="Tuỳ chỉnh"
            aria-label="Mở bảng tuỳ chỉnh"
          >
            <Settings2 size={18} />
          </button>
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
          {navTree("drawer")}
          {email && (
            <span className="app-sidebar-user" title={email}>
              {email}
            </span>
          )}
          <form action={signOutAction}>
            <button type="submit" className="app-nav-link app-nav-link--drawer" style={{ width: "100%", cursor: "pointer" }}>
              <LogOut size={18} />
              Đăng xuất
            </button>
          </form>
        </div>
      </Drawer>

      <ConfigDrawer
        open={configOpen}
        navPrefs={navPrefs}
        roadmapPhases={roadmapPhases}
        timetableRows={timetableRows}
        onClose={() => setConfigOpen(false)}
      />
    </div>
  );
}
