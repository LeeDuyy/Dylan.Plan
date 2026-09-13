"use client";

import { Button, Switcher } from "@vn-dylan/ui";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { navGroups } from "@/components/shared/nav";
import { groupPrefId, leafPrefId, type NavPref } from "@/lib/nav-registry";
import { reorderNav, resetNavConfig, setNavVisibility } from "@/server/config/actions";

function move(ids: string[], index: number, direction: -1 | 1): string[] | null {
  const target = index + direction;
  if (target < 0 || target >= ids.length) return null;
  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

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
    .sort((a, b) => orderOf(groupPrefId(a.group.id), a.index) - orderOf(groupPrefId(b.group.id), b.index));

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

  const moveGroup = (index: number, direction: -1 | 1) => {
    const next = move(
      groupRows.map((row) => groupPrefId(row.group.id)),
      index,
      direction
    );
    if (next) run(() => reorderNav({ orderedIds: next }));
  };

  const moveChild = (childHrefs: string[], index: number, direction: -1 | 1) => {
    const next = move(childHrefs.map(leafPrefId), index, direction);
    if (next) run(() => reorderNav({ orderedIds: next }));
  };

  const toggle = (id: string, visible: boolean) => run(() => setNavVisibility({ id, hidden: !visible }));

  return (
    <div className="config-drawer">
      <div className="config-section">
        <h3>Menu điều hướng</h3>
        <p className="config-hint">Kéo thứ tự bằng mũi tên, tắt công tắc để ẩn một mục khỏi sidebar (route vẫn vào được).</p>
        {error && <p className="config-error">{error}</p>}

        <div className="nav-config-list" aria-busy={pending}>
          {groupRows.map(({ group }, groupIndex) => {
            const gid = groupPrefId(group.id);
            const groupVisible = !isHidden(gid);
            const childRows = group.children
              .map((child, index) => ({ child, index }))
              .sort(
                (a, b) => orderOf(leafPrefId(a.child.href), a.index) - orderOf(leafPrefId(b.child.href), b.index)
              );
            const childHrefs = childRows.map((row) => row.child.href);

            return (
              <div className="nav-config-group" key={group.id}>
                <div className={`nav-config-row${groupVisible ? "" : " is-hidden"}`}>
                  <div className="nav-config-move">
                    <Button
                      size="xs"
                      icon={<ChevronUp size={14} />}
                      disabled={pending || groupIndex === 0}
                      onClick={() => moveGroup(groupIndex, -1)}
                      aria-label={`Đưa ${group.label} lên`}
                    />
                    <Button
                      size="xs"
                      icon={<ChevronDown size={14} />}
                      disabled={pending || groupIndex === groupRows.length - 1}
                      onClick={() => moveGroup(groupIndex, 1)}
                      aria-label={`Đưa ${group.label} xuống`}
                    />
                  </div>
                  <span className="nav-config-label">{group.label}</span>
                  <Switcher
                    checked={groupVisible}
                    disabled={pending}
                    onChange={(checked) => toggle(gid, checked)}
                  />
                </div>

                {childRows.map(({ child }, childIndex) => {
                  const lid = leafPrefId(child.href);
                  const childVisible = !isHidden(lid);
                  return (
                    <div className={`nav-config-row is-child${childVisible ? "" : " is-hidden"}`} key={child.href}>
                      <div className="nav-config-move">
                        <Button
                          size="xs"
                          icon={<ChevronUp size={14} />}
                          disabled={pending || childIndex === 0}
                          onClick={() => moveChild(childHrefs, childIndex, -1)}
                          aria-label={`Đưa ${child.label} lên`}
                        />
                        <Button
                          size="xs"
                          icon={<ChevronDown size={14} />}
                          disabled={pending || childIndex === childRows.length - 1}
                          onClick={() => moveChild(childHrefs, childIndex, 1)}
                          aria-label={`Đưa ${child.label} xuống`}
                        />
                      </div>
                      <span className="nav-config-label">{child.label}</span>
                      <Switcher
                        checked={childVisible}
                        disabled={pending}
                        onChange={(checked) => toggle(lid, checked)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

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
