"use client";

import { AppShell, Button, Inline, Menu, Tooltip } from "@vn-dylan/ui";
import { useDarkMode } from "@vn-dylan/utils";
import { ChevronRight, LogOut, Moon, Settings2, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { ConfigDrawer } from "@/components/shared/ConfigDrawer";
import { useUserEmail } from "@/components/shared/UserSessionContext";
import { activeGroup, applyNavPrefs, currentMeta, navGroups, type NavGroup } from "@/components/shared/nav";
import type { NavPref } from "@/lib/nav-registry";
import type { RoadmapPhaseView } from "@/lib/roadmap-defaults";
import type { TimetableRowView } from "@/lib/timetable-defaults";
import { signOutAction } from "@/server/auth/actions";

// Khung trang dùng `AppShell` của design system: sidebar cố định (thành Drawer dưới
// breakpoint `lg`), header dính trên cùng, vùng nội dung cuộn riêng và footer.
export function AppFrame({
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
  const pathname = usePathname() ?? "/";
  const [dark, setMode] = useDarkMode();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Cây nav sau khi áp thứ tự + ẩn/hiện từ DB (NavPref).
  const groups = useMemo(() => applyNavPrefs(navGroups, navPrefs), [navPrefs]);
  const meta = currentMeta(pathname);

  useEffect(() => setMounted(true), []);

  // Đổi route → đóng Drawer điều hướng trên mobile.
  useEffect(() => setMobileNavOpen(false), [pathname]);

  // `useDarkMode` chỉ biết giá trị thật (localStorage / prefers-color-scheme) sau khi
  // mount ở client — chờ mounted rồi mới chọn icon để khớp SSR, tránh hydration mismatch.
  const themeIcon = mounted && dark ? <Sun size={18} /> : <Moon size={18} />;
  const nav = <SideNav groups={groups} pathname={pathname} />;

  return (
    <AppShell className="app-frame" mobileNavOpen={mobileNavOpen} onMobileNavOpenChange={setMobileNavOpen}>
      {/* AppShell chỉ biết viewport sau khi mount (SSR coi như mobile, không có sidebar).
          Trước đó render sẵn cùng menu vào một sidebar tĩnh — CSS ẩn nó dưới `lg` — để
          màn desktop không bị sidebar "nhảy" vào sau khi hydrate. */}
      {mounted ? (
        <AppShell.Sidebar aria-label="Điều hướng chính">{nav}</AppShell.Sidebar>
      ) : (
        <aside aria-label="Điều hướng chính" className="dyl-app-shell__sidebar app-frame-ssr-sidebar">
          {nav}
        </aside>
      )}

      <AppShell.Content>
        <AppShell.Header>
          <AppShell.MobileNavTrigger aria-label="Mở menu điều hướng" />
          <nav aria-label="Vị trí hiện tại" className="app-frame-crumb">
            {meta.group && (
              <>
                <span>{meta.group}</span>
                <ChevronRight size={14} aria-hidden />
              </>
            )}
            <strong>{meta.title}</strong>
          </nav>
          <Inline gap="tight" className="app-frame-actions">
            <Tooltip title="Tuỳ chỉnh">
              <Button variant="plain" aria-label="Mở bảng tuỳ chỉnh" icon={<Settings2 size={18} />} onClick={() => setConfigOpen(true)} />
            </Tooltip>
            <Tooltip title="Đổi giao diện sáng / tối">
              <Button
                variant="plain"
                aria-label="Đổi giao diện sáng / tối"
                icon={themeIcon}
                onClick={() => setMode(dark ? "light" : "dark")}
              />
            </Tooltip>
          </Inline>
        </AppShell.Header>

        <AppShell.Main transitionKey={pathname}>{children}</AppShell.Main>

        <AppShell.Footer className="app-frame-footer">
          Chuyển việc · Buy to Build · Mini Shop Builder · Budget cá nhân
        </AppShell.Footer>
      </AppShell.Content>

      <ConfigDrawer
        open={configOpen}
        navPrefs={navPrefs}
        roadmapPhases={roadmapPhases}
        timetableRows={timetableRows}
        onClose={() => setConfigOpen(false)}
      />
    </AppShell>
  );
}

// `Menu.MenuItem asElement={Link}` chuyển mọi prop còn lại xuống `Link`, nhưng type của
// MenuItem chỉ khai báo thuộc tính HTMLElement (không có `href`) — truyền qua spread.
const linkTo = (href: string) => ({ href });

function SideNav({ groups, pathname }: { groups: NavGroup[]; pathname: string }) {
  const email = useUserEmail();
  const current = activeGroup(pathname, groups);

  // Accordion một mục: mở sẵn nhóm chứa route hiện tại; đổi route thì chỉ nhóm đó mở.
  const [expanded, setExpanded] = useState<string | null>(current?.id ?? null);
  useEffect(() => setExpanded(current?.id ?? null), [current?.id]);

  return (
    <div className="app-nav">
      <Link className="app-nav-brand" href="/">
        <span className="logo">D</span>
        <span>Dylan Plan</span>
      </Link>

      <div className="app-nav-menu">
        {/* Không truyền `eventKey` cho item: trạng thái active lấy từ route (isActive),
            không để Menu tự nhớ mục vừa bấm. */}
        <Menu defaultCollapseActiveKeys={current ? [current.id] : []}>
          {groups.map((group) => {
            const Icon = group.icon;
            const label = (
              <span className="app-nav-label">
                <Icon size={18} />
                {group.label}
              </span>
            );

            if (group.children.length === 0) {
              return (
                <Menu.MenuItem key={group.id} asElement={Link} {...linkTo(group.href)} isActive={group.match(pathname)}>
                  {label}
                </Menu.MenuItem>
              );
            }

            return (
              <Menu.MenuCollapse
                key={group.id}
                eventKey={group.id}
                label={label}
                expanded={expanded === group.id}
                onToggle={(open) => setExpanded(open ? group.id : null)}
              >
                {group.children.map((child) => (
                  <Menu.MenuItem key={child.href} asElement={Link} {...linkTo(child.href)} isActive={pathname === child.href}>
                    {child.label}
                  </Menu.MenuItem>
                ))}
              </Menu.MenuCollapse>
            );
          })}
        </Menu>
      </div>

      <div className="app-nav-foot">
        {email && (
          <span className="app-nav-user" title={email}>
            {email}
          </span>
        )}
        <form action={signOutAction}>
          <Button type="submit" variant="plain" block icon={<LogOut size={18} />} className="app-nav-signout">
            Đăng xuất
          </Button>
        </form>
      </div>
    </div>
  );
}
