"use client";

import { Button, Input } from "@vn-dylan/ui";
import { ChevronDown, ChevronUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { arrayMove } from "@/lib/array-move";
import { TIMETABLE_DAY_HEADERS, TIMETABLE_DAY_KEYS, type TimetableRowView } from "@/lib/timetable-defaults";
import {
  deleteTimetableRow,
  reorderTimetableRows,
  resetTimetableConfig,
  upsertTimetableRow
} from "@/server/config/actions";

export function TimetableConfigEditor({ rows }: { rows: TimetableRowView[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<TimetableRowView[]>(rows);

  useEffect(() => setDraft(rows), [rows]);

  const run = (fn: () => Promise<unknown>, refresh = true) => {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        if (refresh) router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Có lỗi xảy ra, vui lòng thử lại.");
        router.refresh();
      }
    });
  };

  const patchRow = (rowId: string, patch: Partial<TimetableRowView>) =>
    setDraft((prev) => prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));

  const saveRow = (row: TimetableRowView) =>
    run(() =>
      upsertTimetableRow({
        id: row.id,
        timeLabel: row.timeLabel,
        mon: row.mon,
        tue: row.tue,
        wed: row.wed,
        thu: row.thu,
        fri: row.fri,
        sat: row.sat,
        sun: row.sun
      })
    );

  const moveRow = (index: number, direction: -1 | 1) => {
    const next = arrayMove(draft, index, direction);
    if (next) run(() => reorderTimetableRows({ orderedIds: next.map((row) => row.id) }));
  };

  return (
    <div className="config-drawer">
      <div className="config-section">
        <h3>Lịch tuần</h3>
        <p className="config-hint">Sửa xong click ra ngoài ô là lưu.</p>
        {error && <p className="config-error">{error}</p>}

        <div className="plan-config-list" aria-busy={pending}>
          {draft.map((row, rowIndex) => (
            <div className="plan-config-card" key={row.id}>
              <div className="plan-config-card-head">
                <Input
                  size="sm"
                  value={row.timeLabel}
                  placeholder="06:30-07:15"
                  onChange={(event) => patchRow(row.id, { timeLabel: event.target.value })}
                  onBlur={() => saveRow(row)}
                />
                <div className="nav-config-move">
                  <Button
                    size="xs"
                    icon={<ChevronUp size={14} />}
                    disabled={pending || rowIndex === 0}
                    onClick={() => moveRow(rowIndex, -1)}
                    aria-label="Đưa dòng lên"
                  />
                  <Button
                    size="xs"
                    icon={<ChevronDown size={14} />}
                    disabled={pending || rowIndex === draft.length - 1}
                    onClick={() => moveRow(rowIndex, 1)}
                    aria-label="Đưa dòng xuống"
                  />
                  <Button
                    size="xs"
                    icon={<Trash2 size={14} />}
                    disabled={pending || draft.length <= 1}
                    onClick={() => run(() => deleteTimetableRow(row.id))}
                    aria-label="Xoá dòng"
                  />
                </div>
              </div>

              <div className="plan-config-days">
                {TIMETABLE_DAY_KEYS.map((day) => (
                  <label className="plan-config-day" key={day}>
                    <span>{TIMETABLE_DAY_HEADERS[day]}</span>
                    <Input
                      size="sm"
                      value={row[day]}
                      onChange={(event) => patchRow(row.id, { [day]: event.target.value })}
                      onBlur={() => saveRow(row)}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="plan-config-actions">
          <Button
            size="sm"
            icon={<Plus size={14} />}
            disabled={pending}
            onClick={() =>
              run(() =>
                upsertTimetableRow({
                  timeLabel: "Khung giờ mới",
                  mon: "",
                  tue: "",
                  wed: "",
                  thu: "",
                  fri: "",
                  sat: "",
                  sun: ""
                })
              )
            }
          >
            Thêm dòng
          </Button>
          <Button
            size="sm"
            icon={<RotateCcw size={14} />}
            disabled={pending}
            onClick={() => run(() => resetTimetableConfig())}
          >
            Khôi phục mặc định
          </Button>
        </div>
      </div>
    </div>
  );
}
