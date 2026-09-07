"use client";

import { Button, Card, Dropdown, Input, Popconfirm, Select, Space, Table } from "antd";
import type { TableProps } from "antd";
import { Check, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Toast } from "@/components/shared/Toast";
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

const LINK_MESSAGE_TTL_MS = 5_000;
const LINK_READING_TTL_MS = 10_000;
const LINK_FIELD_MESSAGES: Record<JobLinkField, string> = {
  company: "chưa lấy được Công ty — mời nhập tay",
  platform: "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới",
  deadline: "chưa lấy được Ngày hết hạn — mời chọn tay"
};

const EMPTY_JOB_FORM: JobForm = {
  company: "",
  deadline: "",
  platformId: "",
  link: "",
  status: "Interested",
  note: ""
};

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
    note: job.note ?? ""
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
    note: form.note
  };
}

function validateJobForm(form: JobForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.company.trim()) errors.company = "Nhập tên công ty.";
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
  const [draft, setDraft] = useState<JobForm>(EMPTY_JOB_FORM);
  const [adding, setAdding] = useState(false);
  const [sort, setSort] = useState<SortState>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, FieldErrors>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteJobId, setConfirmDeleteJobId] = useState<string | null>(null);
  const [readingLinkByKey, setReadingLinkByKey] = useState<ReadingLinkMap>({});
  const [linkMessages, setLinkMessages] = useState<LinkMessageMap>({});
  const jobsRef = useRef<ClientJob[]>(initialJobs);
  const draftRef = useRef(draft);
  const lastReadLinkRef = useRef<Record<string, string>>(
    Object.fromEntries(initialJobs.map((job) => [job.id, job.link]))
  );
  const readingTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const messageTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const platformNameById = useMemo(() => new Map(platforms.map((platform) => [platform.id, platform.name])), [platforms]);

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

  const sortedJobs = useMemo(() => {
    if (!sort) return jobs;
    const getValue = (job: ClientJob) => {
      if (sort.column === "deadline") return toDateInputValue(job.deadline);
      if (sort.column === "platformId") return platformNameById.get(job.platformId) ?? "";
      return String(job[sort.column] ?? "");
    };
    return [...jobs].sort((a, b) => {
      const result = getValue(a).localeCompare(getValue(b), "vi", { numeric: true, sensitivity: "base" });
      return sort.direction === "asc" ? result : -result;
    });
  }, [jobs, platformNameById, sort]);

  const refreshSnapshot = async (): Promise<JobTrackerSnapshot> => {
    const snapshot = await getJobTrackerSnapshot();
    setJobs(snapshot.jobs);
    setPlatforms(snapshot.platforms);
    return snapshot;
  };

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
    const errors = validateJobForm(form);
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
    const errors = validateJobForm(draft);
    if (hasErrors(errors)) {
      setRowErrors("draft", errors);
      return;
    }

    setSavingId("draft");
    try {
      await createJobApplication(toUpsertInput(draft));
      clearRowErrors("draft");
      resetLinkReadState("draft");
      setDraft(EMPTY_JOB_FORM);
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

  const tableRows: JobTableRow[] = [
    ...(adding ? ([{ key: "draft", kind: "draft" }] as JobTableRow[]) : []),
    ...sortedJobs.map((job) => ({ key: job.id, kind: "job" as const, job }))
  ];

  const sortOrder = (column: SortColumn) =>
    sort?.column === column ? (sort.direction === "asc" ? "ascend" : "descend") : null;

  const handleTableChange: TableProps<JobTableRow>["onChange"] = (_pagination, _filters, sorter) => {
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    if (!activeSorter?.columnKey || !activeSorter.order) return;
    setSort({
      column: activeSorter.columnKey as SortColumn,
      direction: activeSorter.order === "ascend" ? "asc" : "desc"
    });
  };

  const columns: TableProps<JobTableRow>["columns"] = [
    {
      title: "Công ty",
      key: "company",
      width: 170,
      sorter: true,
      sortOrder: sortOrder("company"),
      render: (_, row) =>
        row.kind === "draft" ? (
          <JobTextInput error={fieldErrors.draft?.company} onChange={(company) => setDraft((current) => ({ ...current, company }))} value={draft.company} />
        ) : (
          <JobTextInput
            error={fieldErrors[row.job.id]?.company}
            onBlur={() => commitJob(row.job.id)}
            onChange={(company) => updateJobLocal(row.job.id, { company })}
            value={row.job.company}
          />
        )
    },
    {
      title: "Ngày hết hạn",
      key: "deadline",
      width: 150,
      sorter: true,
      sortOrder: sortOrder("deadline"),
      render: (_, row) =>
        row.kind === "draft" ? (
          <JobDateInput error={fieldErrors.draft?.deadline} onChange={(deadline) => setDraft((current) => ({ ...current, deadline }))} value={draft.deadline} />
        ) : (
          <JobDateInput
            error={fieldErrors[row.job.id]?.deadline}
            onBlur={() => commitJob(row.job.id)}
            onChange={(deadline) => updateJobLocal(row.job.id, { deadline })}
            title={formatDate(row.job.deadline)}
            value={toDateInputValue(row.job.deadline)}
          />
        )
    },
    {
      title: "Platform",
      key: "platformId",
      width: 170,
      sorter: true,
      sortOrder: sortOrder("platformId"),
      render: (_, row) =>
        row.kind === "draft" ? (
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
        )
    },
    {
      title: "Link",
      key: "link",
      width: 240,
      sorter: true,
      sortOrder: sortOrder("link"),
      render: (_, row) =>
        row.kind === "draft" ? (
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
            <Button href={row.job.link} rel="noreferrer" target="_blank" title="Mở link" type="text" icon={<ExternalLink size={15} />} />
          </div>
        )
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 160,
      sorter: true,
      sortOrder: sortOrder("status"),
      render: (_, row) =>
        row.kind === "draft" ? (
          <StatusSelect onChange={(status) => setDraft((current) => ({ ...current, status }))} value={draft.status} />
        ) : (
          <StatusSelect
            onChange={(status) => {
              updateJobLocal(row.job.id, { status });
              commitJob(row.job.id, { status });
            }}
            value={row.job.status}
          />
        )
    },
    {
      title: "Ngày nộp hồ sơ",
      key: "submittedAt",
      width: 150,
      render: (_, row) => (row.kind === "draft" ? "-" : formatDateTime(row.job.submittedAt) || "-")
    },
    {
      title: "Ghi chú",
      key: "note",
      width: 220,
      sorter: true,
      sortOrder: sortOrder("note"),
      render: (_, row) =>
        row.kind === "draft" ? (
          <JobNoteInput onChange={(note) => setDraft((current) => ({ ...current, note }))} value={draft.note} />
        ) : (
          <JobNoteInput onBlur={() => commitJob(row.job.id)} onChange={(note) => updateJobLocal(row.job.id, { note })} value={row.job.note ?? ""} />
        )
    },
    {
      title: "",
      key: "actions",
      width: 96,
      render: (_, row) =>
        row.kind === "draft" ? (
          <Space>
            <Button type="text" disabled={savingId === "draft"} onClick={saveDraft} title="Lưu job" icon={<Check size={16} />} />
            <Button
              type="text"
              disabled={savingId === "draft"}
              onClick={() => {
                setAdding(false);
                setDraft(EMPTY_JOB_FORM);
                clearRowErrors("draft");
                resetLinkReadState("draft");
              }}
              title="Hủy thêm job"
              icon={<X size={16} />}
            />
          </Space>
        ) : (
          <Popconfirm
            title="Xóa?"
            okText="Xác nhận xóa"
            cancelText="Hủy xóa"
            open={confirmDeleteJobId === row.job.id}
            onOpenChange={(open) => setConfirmDeleteJobId(open ? row.job.id : null)}
            onConfirm={() => confirmDeleteJob(row.job.id)}
          >
            <Button type="text" danger disabled={savingId === row.job.id} title="Xóa job" icon={<Trash2 size={16} />} />
          </Popconfirm>
        )
    }
  ];

  return (
    <>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      <section className="section" id="job-tracker">
        <div className="container">
          <Card className="panel job-tracker-panel">
            <div className="section-head job-tracker-head">
              <div>
                <span className="eyebrow">Ứng tuyển</span>
                <h2>Theo dõi CV ứng tuyển</h2>
              </div>
              <Button type="primary" onClick={() => setAdding(true)} icon={<Plus size={18} />}>
                Thêm job
              </Button>
            </div>

            <Table<JobTableRow>
              className="job-tracker-table"
              columns={columns}
              dataSource={tableRows}
              locale={{ emptyText: "Chưa có job nào." }}
              onChange={handleTableChange}
              pagination={false}
              rowKey="key"
              scroll={{ x: "max-content" }}
              sortDirections={["ascend", "descend"]}
              sticky
            />
          </Card>
        </div>
      </section>
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
      <Input onBlur={onBlur} onChange={(event) => onChange(event.target.value)} value={value} />
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
      <Input.TextArea onBlur={onBlur} onChange={(event) => onChange(event.target.value)} rows={3} value={value} />
      {error && <span className="job-field-error">{error}</span>}
    </div>
  );
}

function JobDateInput({
  error,
  onBlur,
  onChange,
  title,
  value
}: {
  error?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  title?: string;
  value: string;
}) {
  return (
    <div className="job-field">
      <Input onBlur={onBlur} onChange={(event) => onChange(event.target.value)} title={title} type="date" value={value} />
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
      <Input onBlur={(event) => onBlur?.(event.target.value)} onChange={(event) => onChange(event.target.value)} value={value} />
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
      onChange={onChange}
      options={STATUS_OPTIONS.map((status) => ({ label: status, value: status }))}
      value={value}
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
      // Giữ menu mở sau khi thêm — để Dylan thấy option mới xuất hiện ngay trong danh
      // sách (đã chọn sẵn), thay vì đóng ngay khiến option mới chỉ "ngầm" được chọn mà
      // không nhìn thấy trong lúc đang mở dropdown.
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.";
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
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        trigger={["click"]}
        menu={{ items: [] }}
        popupRender={() => (
          <div className="platform-menu">
            {platforms.map((platform) => (
              <div className="platform-option" key={platform.id}>
                <Button
                  className={platform.id === value ? "selected" : ""}
                  disabled={busy}
                  onClick={() => {
                    onChange(platform.id);
                    setOpen(false);
                  }}
                  type="text"
                >
                  {platform.name}
                </Button>
                <Button
                  className="platform-delete"
                  disabled={busy}
                  onClick={(event) => {
                    event.stopPropagation();
                    removePlatform(platform);
                  }}
                  title={`Xóa ${platform.name}`}
                  type="text"
                  icon={<X size={14} />}
                />
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
        )}
      >
        <Button className="platform-trigger" aria-expanded={open}>
          <span>{currentLabel}</span>
        </Button>
      </Dropdown>
      {error && <span className="job-field-error">{error}</span>}
    </div>
  );
}
