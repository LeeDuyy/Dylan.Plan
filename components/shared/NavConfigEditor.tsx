"use client";

import { Button, List, Stack, Switcher } from "@vn-dylan/ui";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { navGroups, type NavGroup, type NavLeaf } from "@/components/shared/nav";
import { groupPrefId, leafPrefId, type NavPref } from "@/lib/nav-registry";
import { reorderNav, resetNavConfig, setNavVisibility } from "@/server/config/actions";

// Trình sửa menu: kéo-thả (hoặc Alt + ↑/↓ khi đang focus) để đổi thứ tự, công tắc để
// ẩn/hiện. Dùng `List sortable` của design system. Các `List` sortable KHÔNG lồng nhau
// (sự kiện kéo-thả của list con sẽ nổi bọt lên list cha) nên nhóm và mục con nằm ở các
// danh sách riêng: một danh sách nhóm, rồi mỗi nhóm có một danh sách mục con.
export function NavConfigEditor({ navPrefs }: { navPrefs: NavPref[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const prefById = new Map(navPrefs.map((pref) => [pref.id, pref]));
  const orderOf = (id: string, fallback: number) => prefById.get(id)?.order ?? fallback;
  const isHidden = (id: string) => prefById.get(id)?.hidden ?? false;

  // Danh sách đầy đủ (kể cả mục đang ẩn) để chỉnh, đã sắp theo thứ tự hiện tại.
  const groupRows = navGroups
    .map((group, index) => ({ group, index }))
    .sort((a, b) => orderOf(groupPrefId(a.group.id), a.index) - orderOf(groupPrefId(b.group.id), b.index))
    .map(({ group }) => group);

  const childRowsOf = (group: NavGroup) =>
    group.children
      .map((child, index) => ({ child, index }))
      .sort((a, b) => orderOf(leafPrefId(a.child.href), a.index) - orderOf(leafPrefId(b.child.href), b.index))
      .map(({ child }) => child);

  const run = (fn: () => Promise<void>) => {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Có lỗi xảy ra, vui lòng thử lại.");
        router.refresh();
      }
    });
  };

  const toggle = (id: string, visible: boolean) => run(() => setNavVisibility({ id, hidden: !visible }));

  const row = (label: string, id: string) => {
    const visible = !isHidden(id);
    return (
      <List.Item
        title={<span className={visible ? undefined : "nav-config-label is-hidden"}>{label}</span>}
        actions={
          <Switcher
            checked={visible}
            disabled={pending}
            onChange={(checked) => toggle(id, checked)}
            aria-label={`${visible ? "Ẩn" : "Hiện"} ${label}`}
          />
        }
      />
    );
  };

  return (
    <div className="config-drawer">
      <div className="config-section">
        <h3>Menu điều hướng</h3>
        <p className="config-hint">
          Kéo từng hàng (hoặc chọn hàng rồi nhấn Alt + ↑/↓) để đổi thứ tự. Tắt công tắc để ẩn một mục khỏi sidebar
          (route vẫn vào được).
        </p>
        {error && <p className="config-error">{error}</p>}

        <Stack gap="base" className="nav-config-list" aria-busy={pending}>
          <List<NavGroup>
            bordered
            sortable
            aria-label="Thứ tự các nhóm menu"
            items={groupRows}
            getKey={(group) => group.id}
            onReorder={(next) => run(() => reorderNav({ orderedIds: next.map((group) => groupPrefId(group.id)) }))}
            renderItem={(group) => row(group.label, groupPrefId(group.id))}
          />

          {groupRows
            .filter((group) => group.children.length > 0)
            .map((group) => (
              <Stack gap="tight" key={group.id}>
                <span className="eyebrow">{group.label}</span>
                <List<NavLeaf>
                  bordered
                  sortable
                  aria-label={`Thứ tự mục con của ${group.label}`}
                  items={childRowsOf(group)}
                  getKey={(child) => child.href}
                  onReorder={(next) => run(() => reorderNav({ orderedIds: next.map((child) => leafPrefId(child.href)) }))}
                  renderItem={(child) => row(child.label, leafPrefId(child.href))}
                />
              </Stack>
            ))}
        </Stack>

        <Button
          size="sm"
          icon={<RotateCcw size={14} />}
          disabled={pending}
          onClick={() => run(() => resetNavConfig())}
        >
          Khôi phục mặc định
        </Button>
      </div>
    </div>
  );
}
