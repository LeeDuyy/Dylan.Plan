"use client";

import { Button, Card, ConfirmDialog, DataTable, DatePicker, Input, Select, Tabs, type ColumnDef, type DataTableSort } from "@vn-dylan/ui";
import { Check, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EmptyHint } from "@/components/shared/blocks";
import { PageFrame } from "@/components/shared/PageFrame";
import { Toast } from "@/components/shared/Toast";
import { parseDateInput, toDateInput } from "@/lib/date-input";
import { opt, selected } from "@/components/shared/ui";
import {
  createJobApplication,
  createJobPlatform,
  deleteJobApplication,
  deleteJobPlatform,
  getJobTrackerSnapshot,
  readJobLink,
  updateJobApplication
} from "@/server/job-tracker/actions";
import type {
  JobApplicationEntity,
  JobApplicationOwner,
  JobApplicationStatus,
  JobLinkField,
  JobLinkReadResult,
  JobPlatformEntity,
  JobTrackerSnapshot,
  UpsertJobApplicationInput
} from "@/server/job-tracker/actions";

const STATUS_OPTIONS: JobApplicationStatus[] = [
  "Interested",
  "Waiting",
  "No Response",
  "Response",
  "Appointment",
  "Cancel",
  "Fail",
  "Expired"
];

const STATUS_CLASS: Record<JobApplicationStatus, string> = {
  Interested: "status-interested",
  Waiting: "status-waiting",
  "No Response": "status-no-response",
  Response: "status-response",
  Appointment: "status-appointment",
  Cancel: "status-cancel",
  Fail: "status-fail",
  Expired: "status-expired"
};

type JobField = "company" | "deadline" | "platformId" | "link" | "status" | "note";
type SortColumn = JobField;
type SortState = { column: SortColumn; direction: "asc" | "desc" } | null;
type JobForm = {
  company: string;
  deadline: string;
  platformId: string;
  link: string;
  status: JobApplicationStatus;
  note: string;
  owner: JobApplicationOwner;
};
type ClientJob = Omit<JobApplicationEntity, "deadline" | "submittedAt" | "createdAt" | "updatedAt"> & {
  deadline: Date | string | null;
  submittedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};
type FieldErrors = Partial<Record<JobField, string>>;
type LinkMessageMap = Record<string, string[]>;
type ReadingLinkMap = Record<string, boolean>;
type JobTableRow =
  | { key: "draft"; kind: "draft" }
  | { key: string; kind: "job"; job: ClientJob };

const JOB_PAGE_SIZE_OPTIONS = [10, 25, 50];

const LINK_MESSAGE_TTL_MS = 5_000;
const LINK_READING_TTL_MS = 10_000;
const LINK_FIELD_MESSAGES: Record<JobLinkField, string> = {
  company: "chưa lấy được Công ty — mời nhập tay",
  platform: "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới",
  deadline: "chưa lấy được Ngày hết hạn — mời chọn tay"
};

function emptyJobForm(owner: JobApplicationOwner): JobForm {
  return {
    company: "",
    deadline: "",
    platformId: "",
    link: "",
    status: "Interested",
    note: "",
    owner
  };
}

const OWNER_TABS: { value: JobApplicationOwner; label: string }[] = [
  { value: "me", label: "Tôi" },
  { value: "olivia", label: "Olivia" }
];

const STATUS_SELECT_OPTIONS = STATUS_OPTIONS.map((status) => opt(status));

type JobColumn = { key: SortColumn | "submittedAt" | "actions"; title: string; sortable: boolean };
const COLUMNS: JobColumn[] = [
  { key: "company", title: "Công ty", sortable: true },
  { key: "deadline", title: "Ngày hết hạn", sortable: true },
  { key: "platformId", title: "Platform", sortable: true },
  { key: "link", title: "Link", sortable: true },
  { key: "status", title: "Trạng thái", sortable: true },
  { key: "submittedAt", title: "Ngày nộp hồ sơ", sortable: false },
  { key: "note", title: "Ghi chú", sortable: true },
  { key: "actions", title: "Thao tác", sortable: false }
];

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

function toDateInputValue(value: Date | string | null) {
  if (value === null) return "";
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function formatDate(value: Date | string | null) {
  const input = toDateInputValue(value);
  if (!input) return "";
  const [year, month, day] = input.split("-");
  return `${day}/${month}/${year}`;
}

function formatDateTime(value: Date | string | null) {
  if (value === null) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (part: number) => String(part).padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function toJobForm(job: ClientJob): JobForm {
  return {
    company: job.company,
    deadline: toDateInputValue(job.deadline),
    platformId: job.platformId,
    link: job.link,
    status: job.status,
    note: job.note ?? "",
    owner: job.owner
  };
}

function toUpsertInput(form: JobForm, id?: string): UpsertJobApplicationInput {
  return {
    ...(id ? { id } : {}),
    company: form.company,
    deadline: form.deadline,
    platformId: form.platformId,
    link: form.link,
    status: form.status,
    note: form.note,
    owner: form.owner
  };
}

// Khớp đúng logic chuẩn hoá tên ở server (server/job-tracker/domain/rules/job-company-name-rule.ts)
// để chặn trùng tên công ty NGAY ở client trước khi gọi Server Action.
function normalizeJobCompanyNameClient(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

// Tìm kiếm không phân biệt hoa/thường và không phân biệt dấu tiếng Việt
// (vd. gõ "cong ty" vẫn khớp "Công Ty"). `normalize("NFD")` không tách được
// "đ"/"Đ" thành d + dấu (đây là ký tự Unicode riêng, không phải d có dấu),
// nên phải thay thủ công trước khi bỏ dấu các ký tự còn lại.
function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function findDuplicateJobCompany(company: string, jobs: ClientJob[], excludeId?: string): boolean {
  const normalized = normalizeJobCompanyNameClient(company);
  if (!normalized) return false;
  return jobs.some((job) => {
    if (excludeId && job.id === excludeId) return false;
    return normalizeJobCompanyNameClient(job.company) === normalized;
  });
}

function validateJobForm(form: JobForm, jobs: ClientJob[], excludeId?: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.company.trim()) {
    errors.company = "Nhập tên công ty.";
  } else if (findDuplicateJobCompany(form.company, jobs, excludeId)) {
    errors.company = `Công ty "${form.company.trim()}" đã có trong danh sách theo dõi. Vui lòng đổi tên khác.`;
  }
  if (!form.platformId.trim()) errors.platformId = "Chọn Platform.";
  if (!form.link.trim()) {
    errors.link = "Nhập link tin tuyển dụng.";
  } else if (!/^https?:\/\//i.test(form.link.trim())) {
    errors.link = "Link phải bắt đầu bằng http:// hoặc https://.";
  }
  return errors;
}

function hasErrors(errors: FieldErrors) {
  return Object.keys(errors).length > 0;
}

function isLinkFieldEmpty(form: JobForm, field: JobLinkField) {
  if (field === "company") return !form.company.trim();
  if (field === "platform") return !form.platformId.trim();
  return !form.deadline.trim();
}

function buildReadLinkPatch(result: JobLinkReadResult, form: JobForm): Partial<JobForm> {
  const patch: Partial<JobForm> = {};
  if (!form.company.trim() && result.company) patch.company = result.company;
  if (!form.platformId.trim() && result.platformId) patch.platformId = result.platformId;
  if (!form.deadline.trim() && result.deadline) patch.deadline = result.deadline;
  return patch;
}

function buildReadLinkMessages(result: JobLinkReadResult, form: JobForm) {
  return result.missing
    .filter((field) => isLinkFieldEmpty(form, field))
    .map((field) => LINK_FIELD_MESSAGES[field]);
}

export function JobTrackerBoard({
  initialJobs,
  initialPlatforms
}: {
  initialJobs: JobApplicationEntity[];
  initialPlatforms: JobPlatformEntity[];
}) {
  const [jobs, setJobs] = useState<ClientJob[]>(initialJobs);
  const [platforms, setPlatforms] = useState<JobPlatformEntity[]>(initialPlatforms);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const platformNameById = useMemo(() => new Map(platforms.map((platform) => [platform.id, platform.name])), [platforms]);

  const refreshSnapshot = async (): Promise<JobTrackerSnapshot> => {
    const snapshot = await getJobTrackerSnapshot();
    setJobs(snapshot.jobs);
    setPlatforms(snapshot.platforms);
    return snapshot;
  };

  return (
    <PageFrame>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      <section className="job-tracker-fill" id="job-tracker">
        <Card className="job-tracker-panel">
            <Tabs className="job-tracker-tabs" defaultValue="me" variant="underline">
              <Tabs.TabList>
                {OWNER_TABS.map((tab) => (
                  <Tabs.TabNav key={tab.value} value={tab.value}>
                    {tab.label}
                  </Tabs.TabNav>
                ))}
              </Tabs.TabList>

              {OWNER_TABS.map((tab) => (
                <Tabs.TabContent key={tab.value} value={tab.value}>
                  <JobOwnerPanel
                    jobs={jobs}
                    owner={tab.value}
                    platformNameById={platformNameById}
                    platforms={platforms}
                    refreshSnapshot={refreshSnapshot}
                    setJobs={setJobs}
                    setToastMessage={setToastMessage}
                  />
                </Tabs.TabContent>
              ))}
            </Tabs>
        </Card>
      </section>
    </PageFrame>
  );
}

function JobOwnerPanel({
  jobs: allJobs,
  owner,
  platformNameById,
  platforms,
  refreshSnapshot,
  setJobs,
  setToastMessage
}: {
  jobs: ClientJob[];
  owner: JobApplicationOwner;
  platformNameById: Map<string, string>;
  platforms: JobPlatformEntity[];
  refreshSnapshot: () => Promise<JobTrackerSnapshot>;
  setJobs: (updater: (current: ClientJob[]) => ClientJob[]) => void;
  setToastMessage: (message: string | null) => void;
}) {
  const jobs = useMemo(() => allJobs.filter((job) => job.owner === owner), [allJobs, owner]);
  const [draft, setDraft] = useState<JobForm>(() => emptyJobForm(owner));
  const [adding, setAdding] = useState(false);
  const [sort, setSort] = useState<SortState>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(JOB_PAGE_SIZE_OPTIONS[0]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, FieldErrors>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteJobId, setConfirmDeleteJobId] = useState<string | null>(null);
  const [readingLinkByKey, setReadingLinkByKey] = useState<ReadingLinkMap>({});
  const [linkMessages, setLinkMessages] = useState<LinkMessageMap>({});
  const jobsRef = useRef<ClientJob[]>(jobs);
  const draftRef = useRef(draft);
  const lastReadLinkRef = useRef<Record<string, string>>(
    Object.fromEntries(jobs.map((job) => [job.id, job.link]))
  );
  const readingTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const messageTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    jobsRef.current = jobs;
    for (const job of jobs) {
      if (lastReadLinkRef.current[job.id] === undefined) {
        lastReadLinkRef.current[job.id] = job.link;
      }
    }
  }, [jobs]);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    return () => {
      Object.values(readingTimeoutRef.current).forEach(clearTimeout);
      Object.values(messageTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  const searchedJobs = useMemo(() => {
    const needle = normalizeSearchText(search);
    if (!needle) return jobs;
    return jobs.filter((job) => normalizeSearchText(job.company).includes(needle));
  }, [jobs, search]);

  const sortedJobs = useMemo(() => {
    if (!sort) return searchedJobs;
    const getValue = (job: ClientJob) => {
      if (sort.column === "deadline") return toDateInputValue(job.deadline);
      if (sort.column === "platformId") return platformNameById.get(job.platformId) ?? "";
      return String(job[sort.column] ?? "");
    };
    return [...searchedJobs].sort((a, b) => {
      const result = getValue(a).localeCompare(getValue(b), "vi", { numeric: true, sensitivity: "base" });
      return sort.direction === "asc" ? result : -result;
    });
  }, [searchedJobs, platformNameById, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const pagedJobs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedJobs.slice(start, start + pageSize);
  }, [page, pageSize, sortedJobs]);

  const updateJobLocal = (id: string, patch: Partial<JobForm>) => {
    setJobs((current) =>
      current.map((job) =>
        job.id === id
          ? {
              ...job,
              ...patch,
              deadline: patch.deadline ?? job.deadline,
              note: patch.note ?? job.note
            }
          : job
      )
    );
  };

  const setRowErrors = (key: string, errors: FieldErrors) => {
    setFieldErrors((current) => ({ ...current, [key]: errors }));
  };

  const clearRowErrors = (key: string) => {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const getCurrentForm = (key: string): JobForm | null => {
    if (key === "draft") return draftRef.current;
    const job = jobsRef.current.find((item) => item.id === key);
    return job ? toJobForm(job) : null;
  };

  const clearReadingLink = (key: string) => {
    if (readingTimeoutRef.current[key]) {
      clearTimeout(readingTimeoutRef.current[key]);
      delete readingTimeoutRef.current[key];
    }
    setReadingLinkByKey((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const markReadingLink = (key: string) => {
    clearReadingLink(key);
    setReadingLinkByKey((current) => ({ ...current, [key]: true }));
    readingTimeoutRef.current[key] = setTimeout(() => clearReadingLink(key), LINK_READING_TTL_MS);
  };

  const setRowLinkMessages = (key: string, messages: string[]) => {
    if (messageTimeoutRef.current[key]) {
      clearTimeout(messageTimeoutRef.current[key]);
      delete messageTimeoutRef.current[key];
    }
    setLinkMessages((current) => {
      const next = { ...current };
      if (messages.length > 0) {
        next[key] = messages;
      } else {
        delete next[key];
      }
      return next;
    });

    if (messages.length > 0) {
      messageTimeoutRef.current[key] = setTimeout(() => {
        setLinkMessages((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
        delete messageTimeoutRef.current[key];
      }, LINK_MESSAGE_TTL_MS);
    }
  };

  const resetLinkReadState = (key: string) => {
    delete lastReadLinkRef.current[key];
    clearReadingLink(key);
    setRowLinkMessages(key, []);
  };

  const readLinkFor = async (key: string, rawLink: string) => {
    const url = rawLink.trim();
    if (!/^https?:\/\//i.test(url) || lastReadLinkRef.current[key] === url) return;

    lastReadLinkRef.current[key] = url;
    setRowLinkMessages(key, []);
    markReadingLink(key);

    try {
      const result = await readJobLink(url);
      const currentForm = getCurrentForm(key);
      if (!currentForm || currentForm.link.trim() !== url || lastReadLinkRef.current[key] !== url) return;

      const patch = buildReadLinkPatch(result, currentForm);
      const nextForm = { ...currentForm, ...patch };
      if (Object.keys(patch).length > 0) {
        if (key === "draft") {
          setDraft((current) => ({ ...current, ...patch }));
        } else {
          updateJobLocal(key, patch);
          await commitJob(key, patch);
        }
      }
      setRowLinkMessages(key, buildReadLinkMessages(result, nextForm));
    } catch {
      // Invalid server-side validation or read errors do not block the existing save flow.
    } finally {
      if (lastReadLinkRef.current[key] === url) {
        clearReadingLink(key);
      }
    }
  };

  const commitJob = async (id: string, overridePatch?: Partial<JobForm>) => {
    const job = jobsRef.current.find((item) => item.id === id);
    if (!job) return;
    const form = { ...toJobForm(job), ...overridePatch };
    const errors = validateJobForm(form, jobsRef.current, id);
    if (hasErrors(errors)) {
      setRowErrors(id, errors);
      return;
    }

    setSavingId(id);
    try {
      await updateJobApplication(toUpsertInput(form, id));
      clearRowErrors(id);
      await refreshSnapshot();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSavingId(null);
    }
  };

  const saveDraft = async () => {
    const errors = validateJobForm(draft, jobsRef.current);
    if (hasErrors(errors)) {
      setRowErrors("draft", errors);
      return;
    }

    setSavingId("draft");
    try {
      await createJobApplication(toUpsertInput(draft));
      clearRowErrors("draft");
      resetLinkReadState("draft");
      setDraft(emptyJobForm(owner));
      setAdding(false);
      await refreshSnapshot();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSavingId(null);
    }
  };

  const confirmDeleteJob = async (id: string) => {
    setSavingId(id);
    try {
      await deleteJobApplication(id);
      await refreshSnapshot();
      setConfirmDeleteJobId(null);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSavingId(null);
    }
  };

  const confirmJob = confirmDeleteJobId ? jobs.find((job) => job.id === confirmDeleteJobId) ?? null : null;

  const tableRows: JobTableRow[] = [
    ...(adding && page === 1 ? ([{ key: "draft", kind: "draft" }] as JobTableRow[]) : []),
    ...pagedJobs.map((job) => ({ key: job.id, kind: "job" as const, job }))
  ];

  // DataTable chạy chế độ "server" (onSort / onSearchChange / pagingData): bảng chỉ
  // giữ trạng thái giao diện (ô tìm kiếm, cột, ghim), còn lọc không dấu, sắp xếp theo
  // tên Platform, phân trang và hàng nháp "Thêm job" vẫn do component này tính.
  // `onSort` phải ổn định — DataTable gọi nó trong effect phụ thuộc vào chính hàm này.
  const handleSort = useCallback(({ key, order }: DataTableSort) => {
    const next: SortState = key && order ? { column: key as SortColumn, direction: order } : null;
    setSort((current) =>
      current?.column === next?.column && current?.direction === next?.direction ? current : next
    );
    setPage(1);
  }, []);

  const renderCell = (column: JobColumn, row: JobTableRow) => {
    if (column.key === "company") {
      return row.kind === "draft" ? (
        <JobTextInput error={fieldErrors.draft?.company} onChange={(company) => setDraft((current) => ({ ...current, company }))} value={draft.company} />
      ) : (
        <JobTextInput
          error={fieldErrors[row.job.id]?.company}
          onBlur={() => commitJob(row.job.id)}
          onChange={(company) => updateJobLocal(row.job.id, { company })}
          value={row.job.company}
        />
      );
    }
    if (column.key === "deadline") {
      return row.kind === "draft" ? (
        <JobDateInput error={fieldErrors.draft?.deadline} onChange={(deadline) => setDraft((current) => ({ ...current, deadline }))} value={draft.deadline} />
      ) : (
        <JobDateInput
          error={fieldErrors[row.job.id]?.deadline}
          onChange={(deadline) => {
            // Chọn ngày từ lịch là một thao tác hoàn chỉnh → lưu ngay (như đổi Trạng thái).
            updateJobLocal(row.job.id, { deadline });
            commitJob(row.job.id, { deadline });
          }}
          value={toDateInputValue(row.job.deadline)}
        />
      );
    }
    if (column.key === "platformId") {
      return row.kind === "draft" ? (
        <PlatformDropdown
          error={fieldErrors.draft?.platformId}
          onChange={(platformId) => setDraft((current) => ({ ...current, platformId }))}
          onRefreshSnapshot={refreshSnapshot}
          platforms={platforms}
          setToastMessage={setToastMessage}
          value={draft.platformId}
        />
      ) : (
        <PlatformDropdown
          error={fieldErrors[row.job.id]?.platformId}
          onChange={(platformId) => {
            updateJobLocal(row.job.id, { platformId });
            commitJob(row.job.id, { platformId });
          }}
          onRefreshSnapshot={refreshSnapshot}
          platforms={platforms}
          selectedLabel={platformNameById.get(row.job.platformId) ?? "Không rõ Platform"}
          setToastMessage={setToastMessage}
          value={row.job.platformId}
        />
      );
    }
    if (column.key === "link") {
      return row.kind === "draft" ? (
        <JobLinkInput
          error={fieldErrors.draft?.link}
          messages={linkMessages.draft ?? []}
          onBlur={(link) => readLinkFor("draft", link)}
          onChange={(link) => setDraft((current) => ({ ...current, link }))}
          reading={Boolean(readingLinkByKey.draft)}
          value={draft.link}
        />
      ) : (
        <div className="job-link-cell">
          <JobLinkInput
            error={fieldErrors[row.job.id]?.link}
            messages={linkMessages[row.job.id] ?? []}
            onBlur={(link) => {
              commitJob(row.job.id);
              readLinkFor(row.job.id, link);
            }}
            onChange={(link) => updateJobLocal(row.job.id, { link })}
            reading={Boolean(readingLinkByKey[row.job.id])}
            value={row.job.link}
          />
          {row.job.link ? (
            <a className="job-link-open icon-button" href={row.job.link} rel="noreferrer" target="_blank" title="Mở link">
              <ExternalLink size={15} />
            </a>
          ) : null}
        </div>
      );
    }
    if (column.key === "status") {
      return row.kind === "draft" ? (
        <StatusSelect onChange={(status) => setDraft((current) => ({ ...current, status }))} value={draft.status} />
      ) : (
        <StatusSelect
          onChange={(status) => {
            updateJobLocal(row.job.id, { status });
            commitJob(row.job.id, { status });
          }}
          value={row.job.status}
        />
      );
    }
    if (column.key === "submittedAt") {
      return row.kind === "draft" ? "-" : formatDateTime(row.job.submittedAt) || "-";
    }
    if (column.key === "note") {
      return row.kind === "draft" ? (
        <JobNoteInput onChange={(note) => setDraft((current) => ({ ...current, note }))} value={draft.note} />
      ) : (
        <JobNoteInput onBlur={() => commitJob(row.job.id)} onChange={(note) => updateJobLocal(row.job.id, { note })} value={row.job.note ?? ""} />
      );
    }
    // actions
    if (row.kind === "draft") {
      return (
        <div className="job-row-actions">
          <Button variant="plain" size="sm" disabled={savingId === "draft"} onClick={saveDraft} title="Lưu job" icon={<Check size={16} />} />
          <Button
            variant="plain"
            size="sm"
            disabled={savingId === "draft"}
            onClick={() => {
              setAdding(false);
              setDraft(emptyJobForm(owner));
              clearRowErrors("draft");
              resetLinkReadState("draft");
            }}
            title="Hủy thêm job"
            icon={<X size={16} />}
          />
        </div>
      );
    }
    return (
      <Button
        variant="plain"
        size="sm"
        tone="danger"
        disabled={savingId === row.job.id}
        aria-label="Xóa job"
        title="Xóa job"
        icon={<Trash2 size={16} />}
        onClick={() => setConfirmDeleteJobId(row.job.id)}
      />
    );
  };

  // Cột của DataTable phải giữ nguyên tham chiếu giữa các lần render: TanStack render
  // `cell` như một React component, đổi hàm là remount ô → input mất focus mỗi lần gõ.
  // Ô đọc `renderCell` mới nhất qua ref nên vẫn thấy state hiện tại.
  const renderCellRef = useRef(renderCell);
  renderCellRef.current = renderCell;
  const columns = useMemo<ColumnDef<JobTableRow, unknown>[]>(
    () =>
      COLUMNS.map((column) => ({
        id: column.key,
        header: column.title,
        // TanStack chỉ cho sắp xếp cột có accessor — giá trị không dùng tới vì sắp xếp
        // chạy ở `sortedJobs` (onSort).
        accessorFn: (row) => row.key,
        enableSorting: column.sortable,
        enableHiding: column.key !== "company" && column.key !== "actions",
        cell: ({ row }) => (
          <div className={`job-cell job-cell--${column.key}`}>{renderCellRef.current(column, row.original)}</div>
        )
      })),
    []
  );

  return (
    <>
      <div className="job-tracker-table">
        <DataTable<JobTableRow>
          columns={columns}
          data={tableRows}
          getRowId={(row) => row.key}
          emptyMessage={<EmptyHint>{search.trim() ? "Không tìm thấy công ty phù hợp." : "Chưa có job nào. Bấm “Thêm job” để bắt đầu."}</EmptyHint>}
          searchable
          searchPlaceholder="Tìm công ty..."
          onSearchChange={setSearch}
          onSort={handleSort}
          toolbarEnd={
            <Button
              variant="solid"
              onClick={() => {
                setPage(1);
                setAdding(true);
              }}
              icon={<Plus size={18} />}
            >
              Thêm job
            </Button>
          }
          initialState={{ columnPinning: { left: ["company"], right: ["actions"] } }}
          pagingData={{ pageIndex: page, pageSize, total: sortedJobs.length }}
          pageSizeOptions={JOB_PAGE_SIZE_OPTIONS}
          onPaginationChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      <ConfirmDialog
        isOpen={confirmJob != null}
        type="danger"
        title={confirmJob ? `Xóa job "${confirmJob.company || "chưa đặt tên"}"?` : undefined}
        confirmText="Xóa job"
        cancelText="Hủy"
        confirmButtonProps={{ disabled: confirmJob != null && savingId === confirmJob.id }}
        onCancel={() => setConfirmDeleteJobId(null)}
        onClose={() => setConfirmDeleteJobId(null)}
        onConfirm={() => confirmJob && confirmDeleteJob(confirmJob.id)}
      >
        Job sẽ bị xóa khỏi danh sách theo dõi và không thể khôi phục.
      </ConfirmDialog>
    </>
  );
}

function JobTextInput({
  error,
  onBlur,
  onChange,
  value
}: {
  error?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="job-field">
      <Input invalid={Boolean(error)} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} value={value} />
      {error && <span className="job-field-error">{error}</span>}
    </div>
  );
}

function JobNoteInput({
  error,
  onBlur,
  onChange,
  value
}: {
  error?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="job-field job-note-field">
      <Input textArea rows={3} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} value={value} />
      {error && <span className="job-field-error">{error}</span>}
    </div>
  );
}

function JobDateInput({
  error,
  onChange,
  value
}: {
  error?: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="job-field">
      <DatePicker
        aria-label="Ngày hết hạn"
        placeholder="Chọn ngày"
        locale="vi"
        inputFormat="DD/MM/YYYY"
        value={parseDateInput(value)}
        onChange={(date) => onChange(toDateInput(date))}
      />
      {error && <span className="job-field-error">{error}</span>}
    </div>
  );
}

function JobLinkInput({
  error,
  messages = [],
  onBlur,
  onChange,
  reading = false,
  value
}: {
  error?: string;
  messages?: string[];
  onBlur?: (value: string) => void;
  onChange: (value: string) => void;
  reading?: boolean;
  value: string;
}) {
  return (
    <div className="job-field">
      <Input
        invalid={Boolean(error)}
        onBlur={(event) => onBlur?.(event.target.value)}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
      {reading && <span className="job-link-read-status">Đang lấy thông tin...</span>}
      {messages.map((message) => (
        <span className="job-link-read-message" key={message}>
          {message}
        </span>
      ))}
      {error && <span className="job-field-error">{error}</span>}
    </div>
  );
}

function StatusSelect({ onChange, value }: { onChange: (value: JobApplicationStatus) => void; value: JobApplicationStatus }) {
  return (
    <Select
      className={`job-status-select ${STATUS_CLASS[value]}`}
      isClearable={false}
      options={STATUS_SELECT_OPTIONS}
      value={selected(STATUS_SELECT_OPTIONS, value)}
      onChange={(option) => option && onChange(option.value as JobApplicationStatus)}
    />
  );
}

function PlatformDropdown({
  error,
  onChange,
  onRefreshSnapshot,
  platforms,
  selectedLabel,
  setToastMessage,
  value
}: {
  error?: string;
  onChange: (value: string) => void;
  onRefreshSnapshot: () => Promise<JobTrackerSnapshot>;
  platforms: JobPlatformEntity[];
  selectedLabel?: string;
  setToastMessage: (message: string) => void;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const currentLabel = selectedLabel ?? platforms.find((platform) => platform.id === value)?.name ?? "Chọn Platform";

  const addPlatform = async () => {
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    try {
      const created = await createJobPlatform(name);
      await onRefreshSnapshot();
      onChange(created.id);
      setNewName("");
    } catch (err) {
      setToastMessage(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  const removePlatform = async (platform: JobPlatformEntity) => {
    setBusy(true);
    try {
      await deleteJobPlatform(platform.id);
      const snapshot = await onRefreshSnapshot();
      if (value === platform.id && !snapshot.platforms.some((item) => item.id === platform.id)) {
        onChange("");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.";
      setToastMessage(
        message.includes("đang được job")
          ? `Không thể xóa Platform "${platform.name}" vì đang có job sử dụng.`
          : message
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="job-field">
      <div className="platform-picker">
        <button
          type="button"
          className="platform-trigger"
          aria-expanded={open}
          aria-label="Chọn Platform"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{currentLabel}</span>
        </button>
        {open && (
          <>
            <div className="platform-menu-backdrop" onClick={() => setOpen(false)} />
            <div className="platform-menu">
              {platforms.map((platform) => (
                <div className="platform-option" key={platform.id}>
                  <button
                    type="button"
                    className={platform.id === value ? "selected" : ""}
                    disabled={busy}
                    onClick={() => {
                      onChange(platform.id);
                      setOpen(false);
                    }}
                  >
                    {platform.name}
                  </button>
                  <button
                    type="button"
                    className="platform-delete"
                    disabled={busy}
                    onClick={(event) => {
                      event.stopPropagation();
                      removePlatform(platform);
                    }}
                    title={`Xóa ${platform.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="platform-add">
                <Input
                  disabled={busy}
                  onChange={(event) => setNewName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addPlatform();
                    }
                  }}
                  placeholder="+ Thêm platform mới"
                  value={newName}
                />
                <Button disabled={busy || !newName.trim()} onClick={addPlatform} title="Thêm platform" icon={<Plus size={15} />} />
              </div>
            </div>
          </>
        )}
      </div>
      {error && <span className="job-field-error">{error}</span>}
    </div>
  );
}
