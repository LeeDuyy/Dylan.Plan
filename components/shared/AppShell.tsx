"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Grid, Layout, Menu, Space } from "antd";
import { BriefcaseBusiness, CalendarClock, Handshake, Moon, PanelsTopLeft, ShoppingBag, Sun, WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { useAppTheme } from "@/components/shared/AppThemeProvider";
import { UserMenu } from "@/components/shared/UserMenu";

const navItems = [
  { key: "/", label: "Tổng quan", icon: <PanelsTopLeft size={16} /> },
  { key: "/roadmap", label: "Roadmap", icon: <BriefcaseBusiness size={16} /> },
  { key: "/timetable", label: "Thời gian biểu", icon: <CalendarClock size={16} /> },
  { key: "/freelance", label: "Freelance", icon: <Handshake size={16} /> },
  { key: "/product", label: "Sản phẩm", icon: <ShoppingBag size={16} /> },
  { key: "/budget", label: "Thu chi", icon: <WalletCards size={16} /> }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const [mounted, setMounted] = useState(false);
  // `Grid.useBreakpoint()` trả `{}` khi SSR + lần vẽ đầu ở client. Nếu suy ra `isMobile`
  // ngay lúc đó thì màn desktop/tablet chớp qua layout điện thoại rồi mới sửa (kèm nguy
  // cơ hydration mismatch). Chờ mounted rồi mới bật layout điện thoại.
  const isMobile = mounted && !screens.md;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { dark, toggle } = useAppTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedKeys = useMemo(() => [pathname], [pathname]);
  const themeIcon = dark ? <Sun size={18} /> : <Moon size={18} />;

  return (
    <Layout style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Layout.Header
        className="app-shell-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
          position: "sticky",
          top: 0,
          zIndex: 21,
          padding: "0 clamp(12px, 3vw, 24px)"
        }}
      >
        <Link className="brand app-shell-brand" href="/">
          <span className="logo">D</span>
          <span>Dylan Plan Dashboard</span>
        </Link>

        <span style={{ flex: 1 }} />

        <Space align="center" size={8}>
          {!isMobile && <Button type="text" icon={themeIcon} onClick={toggle} title="Đổi giao diện" />}
          <UserMenu />
          {isMobile && <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} title="Chuyển tab" />}
        </Space>
      </Layout.Header>

      {/* Vùng chuyển tab là một dải ngang riêng ngay dưới thanh tiêu đề (spec §8.1):
          có trọn bề ngang màn hình nên cả 6 nhãn nằm một hàng ở cả tablet lẫn màn rộng. */}
      {!isMobile && (
        <div className="app-shell-nav-bar">
          <Menu
            className="app-shell-nav"
            mode="horizontal"
            disabledOverflow
            selectedKeys={selectedKeys}
            items={navItems}
            onClick={(event) => router.push(event.key)}
          />
        </div>
      )}

      <Layout.Content>
        <div className="app-content">{children}</div>
      </Layout.Content>

      <Layout.Footer style={{ textAlign: "center", background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        Bắt đầu 22/06/2026 · Chuyển việc · Buy to Build · Mini Shop Builder · Budget cá nhân
      </Layout.Footer>

      <Drawer title="Chuyển tab" placement="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={navItems}
          onClick={(event) => {
            router.push(event.key);
            setDrawerOpen(false);
          }}
          style={{ borderInlineEnd: "none" }}
        />
        <div style={{ borderTop: "1px solid var(--line)", marginTop: 16, paddingTop: 16 }}>
          <Button block icon={themeIcon} onClick={toggle}>
            Đổi giao diện
          </Button>
        </div>
      </Drawer>
    </Layout>
  );
}
