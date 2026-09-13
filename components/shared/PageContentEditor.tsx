"use client";

import { Button, Input } from "@vn-dylan/ui";
import { ChevronDown, ChevronUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { arrayMove } from "@/lib/array-move";
import type { EditablePageKey, PageBlockView, PageContentView } from "@/lib/page-content-defaults";
import {
  deletePageBlock,
  reorderPageBlocks,
  resetPageContent,
  upsertPageBlock,
  upsertPageText
} from "@/server/pages/actions";

type BlockField = "badge" | "title" | "desc" | "value" | "weight" | "bullets";

// Suy ra field nào đang thật sự dùng trong 1 section từ chính dữ liệu hiện có
// (khác undefined ở ít nhất 1 item) — mỗi trang dùng một tập field khác nhau
// (vd "priorities" có value+weight, "topics" có badge, "weeks" có bullets) nên
// không hardcode form theo từng trang; section rỗng (xoá hết) coi như có sẵn
// title+desc để còn chỗ bấm "Thêm mục".
function sectionFields(items: PageBlockView[]): BlockField[] {
  const fields = new Set<BlockField>();
  for (const item of items) {
    if (item.badge !== undefined) fields.add("badge");
    if (item.title !== undefined) fields.add("title");
    if (item.desc !== undefined) fields.add("desc");
    if (item.value !== undefined) fields.add("value");
    if (item.weight !== undefined) fields.add("weight");
    if (item.bullets !== undefined) fields.add("bullets");
  }
  if (fields.size === 0) {
    fields.add("title");
    fields.add("desc");
  }
  return (["badge", "value", "weight", "title", "desc", "bullets"] as BlockField[]).filter((field) => fields.has(field));
}

const FIELD_LABEL: Record<BlockField, string> = {
  badge: "Nhãn",
  title: "Tiêu đề",
  desc: "Mô tả",
  value: "Số liệu",
  weight: "Độ dài thanh (%)",
  bullets: "Gạch đầu dòng (mỗi dòng 1 mục)"
};

const SECTION_LABEL: Record<string, string> = {
  default: "Danh sách",
  topics: "Nguyên tắc",
  principles: "Nguyên tắc",
  rounds: "Vòng phỏng vấn",
  scorecard: "Scorecard",
  income: "Cơ cấu thu nhập",
  scenarios: "Kịch bản",
  risk: "Điều kiện kiểm soát rủi ro",
  ratio: "Tỷ lệ",
  services: "Gói dịch vụ",
  flow: "Quy trình",
  accept: "Nên nhận",
  reject: "Nên từ chối",
  stack: "Định vị",
  modules: "Module",
  weeks: "Mốc thời gian"
};

const TEXT_LABEL: Record<string, string> = {
  "income.eyebrow": "Nhãn nhỏ khối thu nhập",
  "income.total": "Số tổng thu nhập mục tiêu",
  "income.desc": "Mô tả khối thu nhập",
  "scenarios.eyebrow": "Nhãn nhỏ khối kịch bản",
  "scenarios.title": "Tiêu đề khối kịch bản",
  "risk.eyebrow": "Nhãn nhỏ khối rủi ro",
  "risk.title": "Tiêu đề khối rủi ro",
  "risk.desc": "Mô tả khối rủi ro",
  "ratio.eyebrow": "Nhãn nhỏ",
  "ratio.title": "Tiêu đề",
  "ratio.desc": "Mô tả",
  "ratio.percent": "Phần trăm thanh Progress",
  "principles.eyebrow": "Nhãn nhỏ khối nguyên tắc",
  "principles.title": "Tiêu đề khối nguyên tắc",
  "topics.eyebrow": "Nhãn nhỏ khối 1",
  "topics.title": "Tiêu đề khối 1",
  "rounds.eyebrow": "Nhãn nhỏ khối 2",
  "rounds.title": "Tiêu đề khối 2",
  "scorecard.eyebrow": "Nhãn nhỏ Scorecard",
  "scorecard.title": "Tiêu đề Scorecard",
  "scorecard.desc": "Mô tả Scorecard",
  "gate.eyebrow": "Nhãn nhỏ",
  "gate.title": "Tiêu đề",
  "gate.desc": "Mô tả",
  "gate.acceptTitle": "Tiêu đề cột \"nên nhận\"",
  "gate.rejectTitle": "Tiêu đề cột \"nên từ chối\"",
  "stack.eyebrow": "Nhãn nhỏ",
  "stack.title": "Tiêu đề"
};

function textFieldLabel(key: string): string {
  return TEXT_LABEL[key] ?? key;
}

function sectionLabel(section: string): string {
  return SECTION_LABEL[section] ?? section;
}

export function PageContentEditor({ page, content }: { page: EditablePageKey; content: PageContentView }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<PageContentView>(content);

  // Server là nguồn sự thật — mỗi lần router.refresh() props đổi thì đồng bộ lại draft.
  useEffect(() => setDraft(content), [content]);

  const run = (fn: () => Promise<unknown>) => {
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

  const patchText = (key: string, value: string) =>
    setDraft((prev) => ({ ...prev, texts: { ...prev.texts, [key]: value } }));
  const saveText = (key: string) => run(() => upsertPageText({ page, key, value: draft.texts[key] ?? "" }));

  const patchBlock = (section: string, id: string, patch: Partial<PageBlockView>) =>
    setDraft((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [section]: (prev.blocks[section] ?? []).map((item) => (item.id === id ? { ...item, ...patch } : item))
      }
    }));

  const saveBlock = (section: string, id: string) => {
    const item = draft.blocks[section]?.find((block) => block.id === id);
    if (!item) return;
    run(() =>
      upsertPageBlock({
        id: item.id,
        page,
        section,
        badge: item.badge ?? null,
        title: item.title ?? null,
        desc: item.desc ?? null,
        value: item.value ?? null,
        weight: item.weight ?? null,
        variant: item.variant ?? null,
        bullets: item.bullets
      })
    );
  };

  const addBlock = (section: string, fields: BlockField[]) => {
    const base: Record<string, unknown> = {};
    if (fields.includes("badge")) base.badge = "";
    if (fields.includes("title")) base.title = "Mục mới";
    if (fields.includes("desc")) base.desc = "";
    if (fields.includes("value")) base.value = "";
    if (fields.includes("weight")) base.weight = 0;
    if (fields.includes("bullets")) base.bullets = [];
    run(() => upsertPageBlock({ page, section, ...base }));
  };

  const deleteBlock = (section: string, id: string) => run(() => deletePageBlock(page, id));

  const moveBlock = (section: string, index: number, direction: -1 | 1) => {
    const items = draft.blocks[section] ?? [];
    const next = arrayMove(items, index, direction);
    if (next) run(() => reorderPageBlocks({ page, section, orderedIds: next.map((item) => item.id) }));
  };

  const textKeys = Object.keys(draft.texts);
  const sections = Object.keys(draft.blocks);

  return (
    <div className="config-drawer">
      <div className="config-section">
        <p className="config-hint">Sửa xong click ra ngoài ô là lưu. Layout trang giữ nguyên, chỉ đổi nội dung.</p>
        {error && <p className="config-error">{error}</p>}

        {textKeys.length > 0 && (
          <div className="plan-config-card" aria-busy={pending}>
            <div className="plan-config-card-head">
              <span className="plan-config-card-title">Nội dung chung</span>
            </div>
            <div className="plan-config-fields">
              {textKeys.map((key) => {
                const multiline = key.toLowerCase().includes("desc");
                return (
                  <label key={key} className="page-content-field">
                    <span className="page-content-field-label">{textFieldLabel(key)}</span>
                    <Input
                      size="sm"
                      textArea={multiline}
                      rows={multiline ? 2 : undefined}
                      value={draft.texts[key] ?? ""}
                      onChange={(event) => patchText(key, event.target.value)}
                      onBlur={() => saveText(key)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {sections.map((section) => {
          const items = draft.blocks[section] ?? [];
          const fields = sectionFields(items);
          return (
            <div key={section} className="plan-config-card" aria-busy={pending}>
              <div className="plan-config-card-head">
                <span className="plan-config-card-title">{sectionLabel(section)}</span>
              </div>

              <div className="plan-config-sublist">
                {items.map((item, index) => (
                  <div className="plan-config-subitem" key={item.id}>
                    <div className="nav-config-move">
                      <Button
                        size="xs"
                        icon={<ChevronUp size={14} />}
                        disabled={pending || index === 0}
                        onClick={() => moveBlock(section, index, -1)}
                        aria-label="Đưa mục lên"
                      />
                      <Button
                        size="xs"
                        icon={<ChevronDown size={14} />}
                        disabled={pending || index === items.length - 1}
                        onClick={() => moveBlock(section, index, 1)}
                        aria-label="Đưa mục xuống"
                      />
                      <Button
                        size="xs"
                        icon={<Trash2 size={14} />}
                        disabled={pending}
                        onClick={() => deleteBlock(section, item.id)}
                        aria-label="Xoá mục"
                      />
                    </div>
                    <div className="plan-config-fields">
                      {fields.map((field) => {
                        if (field === "bullets") {
                          return (
                            <label key={field} className="page-content-field">
                              <span className="page-content-field-label">{FIELD_LABEL[field]}</span>
                              <Input
                                size="sm"
                                textArea
                                rows={3}
                                value={(item.bullets ?? []).join("\n")}
                                onChange={(event) =>
                                  patchBlock(section, item.id, {
                                    bullets: event.target.value.split("\n")
                                  })
                                }
                                onBlur={() => saveBlock(section, item.id)}
                              />
                            </label>
                          );
                        }
                        if (field === "weight") {
                          return (
                            <label key={field} className="page-content-field">
                              <span className="page-content-field-label">{FIELD_LABEL[field]}</span>
                              <Input
                                size="sm"
                                inputMode="numeric"
                                value={item.weight != null ? String(item.weight) : ""}
                                onChange={(event) => {
                                  const parsed = Number.parseInt(event.target.value, 10);
                                  patchBlock(section, item.id, { weight: Number.isFinite(parsed) ? parsed : 0 });
                                }}
                                onBlur={() => saveBlock(section, item.id)}
                              />
                            </label>
                          );
                        }
                        const multiline = field === "desc";
                        return (
                          <label key={field} className="page-content-field">
                            <span className="page-content-field-label">{FIELD_LABEL[field]}</span>
                            <Input
                              size="sm"
                              textArea={multiline}
                              rows={multiline ? 2 : undefined}
                              value={(item[field] as string | undefined) ?? ""}
                              onChange={(event) => patchBlock(section, item.id, { [field]: event.target.value })}
                              onBlur={() => saveBlock(section, item.id)}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="plan-config-actions">
                <Button size="xs" icon={<Plus size={13} />} disabled={pending} onClick={() => addBlock(section, fields)}>
                  Thêm mục
                </Button>
              </div>
            </div>
          );
        })}

        <div className="plan-config-actions">
          <Button size="sm" icon={<RotateCcw size={14} />} disabled={pending} onClick={() => run(() => resetPageContent(page))}>
            Khôi phục mặc định
          </Button>
        </div>
      </div>
    </div>
  );
}
