"use client";

import { Button, Input } from "@vn-dylan/ui";
import { ChevronDown, ChevronUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { arrayMove } from "@/lib/array-move";
import type { RoadmapPhaseView } from "@/lib/roadmap-defaults";
import {
  deleteDeliverable,
  deleteRoadmapPhase,
  reorderDeliverables,
  reorderRoadmapPhases,
  resetRoadmapConfig,
  upsertDeliverable,
  upsertRoadmapPhase
} from "@/server/config/actions";

export function RoadmapConfigEditor({ phases }: { phases: RoadmapPhaseView[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<RoadmapPhaseView[]>(phases);

  // Server là nguồn sự thật — mỗi lần router.refresh() props đổi thì đồng bộ lại draft.
  useEffect(() => setDraft(phases), [phases]);

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

  const patchPhase = (phaseId: string, patch: Partial<RoadmapPhaseView>) =>
    setDraft((prev) => prev.map((phase) => (phase.id === phaseId ? { ...phase, ...patch } : phase)));

  const patchDeliverable = (phaseId: string, deliverableId: string, patch: { title?: string; desc?: string }) =>
    setDraft((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              deliverables: phase.deliverables.map((d) => (d.id === deliverableId ? { ...d, ...patch } : d))
            }
          : phase
      )
    );

  const savePhase = (phase: RoadmapPhaseView) =>
    run(() =>
      upsertRoadmapPhase({
        id: phase.id,
        dateRange: phase.dateRange,
        label: phase.label,
        title: phase.title,
        desc: phase.desc
      })
    );

  const saveDeliverable = (phaseId: string, deliverableId: string, title: string, desc: string) =>
    run(() => upsertDeliverable({ id: deliverableId, phaseId, title, desc }));

  const movePhase = (index: number, direction: -1 | 1) => {
    const next = arrayMove(draft, index, direction);
    if (next) run(() => reorderRoadmapPhases({ orderedIds: next.map((p) => p.id) }));
  };

  const moveDeliverable = (phase: RoadmapPhaseView, index: number, direction: -1 | 1) => {
    const next = arrayMove(phase.deliverables, index, direction);
    if (next) run(() => reorderDeliverables({ phaseId: phase.id, orderedIds: next.map((d) => d.id) }));
  };

  return (
    <div className="config-drawer">
      <div className="config-section">
        <h3>Lộ trình roadmap</h3>
        <p className="config-hint">
          Sửa xong click ra ngoài ô là lưu. Khoảng thời gian theo dạng <code>DD/MM-DD/MM</code>.
        </p>
        {error && <p className="config-error">{error}</p>}

        <div className="plan-config-list" aria-busy={pending}>
          {draft.map((phase, phaseIndex) => (
            <div className="plan-config-card" key={phase.id}>
              <div className="plan-config-card-head">
                <span className="plan-config-card-title">{phase.title || "Giai đoạn"}</span>
                <div className="nav-config-move">
                  <Button
                    size="xs"
                    icon={<ChevronUp size={14} />}
                    disabled={pending || phaseIndex === 0}
                    onClick={() => movePhase(phaseIndex, -1)}
                    aria-label="Đưa giai đoạn lên"
                  />
                  <Button
                    size="xs"
                    icon={<ChevronDown size={14} />}
                    disabled={pending || phaseIndex === draft.length - 1}
                    onClick={() => movePhase(phaseIndex, 1)}
                    aria-label="Đưa giai đoạn xuống"
                  />
                  <Button
                    size="xs"
                    icon={<Trash2 size={14} />}
                    disabled={pending || draft.length <= 1}
                    onClick={() => run(() => deleteRoadmapPhase(phase.id))}
                    aria-label="Xoá giai đoạn"
                  />
                </div>
              </div>

              <div className="plan-config-fields">
                <Input
                  size="sm"
                  value={phase.dateRange}
                  placeholder="22/06-30/06"
                  onChange={(event) => patchPhase(phase.id, { dateRange: event.target.value })}
                  onBlur={() => savePhase(phase)}
                />
                <Input
                  size="sm"
                  value={phase.label}
                  placeholder="Nhãn giai đoạn"
                  onChange={(event) => patchPhase(phase.id, { label: event.target.value })}
                  onBlur={() => savePhase(phase)}
                />
                <Input
                  size="sm"
                  value={phase.title}
                  placeholder="Tiêu đề"
                  onChange={(event) => patchPhase(phase.id, { title: event.target.value })}
                  onBlur={() => savePhase(phase)}
                />
                <Input
                  size="sm"
                  textArea
                  rows={2}
                  value={phase.desc}
                  placeholder="Mô tả"
                  onChange={(event) => patchPhase(phase.id, { desc: event.target.value })}
                  onBlur={() => savePhase(phase)}
                />
              </div>

              <div className="plan-config-sublist">
                {phase.deliverables.map((deliverable, deliverableIndex) => (
                  <div className="plan-config-subitem" key={deliverable.id}>
                    <div className="nav-config-move">
                      <Button
                        size="xs"
                        icon={<ChevronUp size={14} />}
                        disabled={pending || deliverableIndex === 0}
                        onClick={() => moveDeliverable(phase, deliverableIndex, -1)}
                        aria-label="Đưa đầu ra lên"
                      />
                      <Button
                        size="xs"
                        icon={<ChevronDown size={14} />}
                        disabled={pending || deliverableIndex === phase.deliverables.length - 1}
                        onClick={() => moveDeliverable(phase, deliverableIndex, 1)}
                        aria-label="Đưa đầu ra xuống"
                      />
                      <Button
                        size="xs"
                        icon={<Trash2 size={14} />}
                        disabled={pending}
                        onClick={() => run(() => deleteDeliverable(deliverable.id))}
                        aria-label="Xoá đầu ra"
                      />
                    </div>
                    <div className="plan-config-fields">
                      <Input
                        size="sm"
                        value={deliverable.title}
                        placeholder="Tên đầu ra"
                        onChange={(event) => patchDeliverable(phase.id, deliverable.id, { title: event.target.value })}
                        onBlur={() => saveDeliverable(phase.id, deliverable.id, deliverable.title, deliverable.desc)}
                      />
                      <Input
                        size="sm"
                        textArea
                        rows={2}
                        value={deliverable.desc}
                        placeholder="Mô tả đầu ra"
                        onChange={(event) => patchDeliverable(phase.id, deliverable.id, { desc: event.target.value })}
                        onBlur={() => saveDeliverable(phase.id, deliverable.id, deliverable.title, deliverable.desc)}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  size="xs"
                  icon={<Plus size={13} />}
                  disabled={pending}
                  onClick={() =>
                    run(() => upsertDeliverable({ phaseId: phase.id, title: "Đầu ra mới", desc: "" }))
                  }
                >
                  Thêm đầu ra
                </Button>
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
                upsertRoadmapPhase({
                  dateRange: "01/01-31/01",
                  label: "Giai đoạn mới",
                  title: "Tiêu đề giai đoạn",
                  desc: ""
                })
              )
            }
          >
            Thêm giai đoạn
          </Button>
          <Button
            size="sm"
            icon={<RotateCcw size={14} />}
            disabled={pending}
            onClick={() => run(() => resetRoadmapConfig())}
          >
            Khôi phục mặc định
          </Button>
        </div>
      </div>
    </div>
  );
}
