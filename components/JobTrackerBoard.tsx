"use client";

import { Check, ChevronDown, ExternalLink, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

  const toggleSort = (column: SortColumn) => {
    setSort((current) =>
      current?.column === column
        ? { column, direction: current.direction === "asc" ? "desc" : "asc" }
        : { column, direction: "asc" }
    );
  };

  const renderSortMark = (column: SortColumn) => {
    if (sort?.column !== column) return "v";
    return sort.direction === "asc" ? "↑" : "↓";
  };

  return (
    <>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      <section className="section" id="job-tracker">
        <div className="container">
          <article className="card panel job-tracker-panel">
            <div className="section-head job-tracker-head">
              <div>
                <span className="eyebrow">Ứng tuyển</span>
                <h2>Theo dõi CV ứng tuyển</h2>
              </div>
              <button className="btn primary" onClick={() => setAdding(true)} type="button">
                <Plus size={18} />
                Thêm job
              </button>
            </div>

            <div className="budget-table-wrap job-tracker-table-wrap">
              <table className="job-tracker-table">
                <thead>
                  <tr>
                    <SortableHeader label="Công ty" mark={renderSortMark("company")} onClick={() => toggleSort("company")} />
                    <SortableHeader
                      label="Ngày hết hạn"
                      mark={renderSortMark("deadline")}
                      onClick={() => toggleSort("deadline")}
                    />
                    <SortableHeader label="Platform" mark={renderSortMark("platformId")} onClick={() => toggleSort("platformId")} />
                    <SortableHeader label="Link" mark={renderSortMark("link")} onClick={() => toggleSort("link")} />
                    <SortableHeader label="Trạng thái" mark={renderSortMark("status")} onClick={() => toggleSort("status")} />
                    <th>Ngày nộp hồ sơ</th>
                    <SortableHeader label="Ghi chú" mark={renderSortMark("note")} onClick={() => toggleSort("note")} />
                    <th aria-label="Thao tác"></th>
                  </tr>
                </thead>
                <tbody>
                  {adding && (
                    <DraftJobRow
                      draft={draft}
                      errors={fieldErrors.draft ?? {}}
                      linkMessages={linkMessages.draft ?? []}
                      onCancel={() => {
                        setAdding(false);
                        setDraft(EMPTY_JOB_FORM);
                        clearRowErrors("draft");
                        resetLinkReadState("draft");
                      }}
                      onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
                      onRefreshSnapshot={refreshSnapshot}
                      onReadLink={(link) => readLinkFor("draft", link)}
                      onSave={saveDraft}
                      platforms={platforms}
                      readingLink={Boolean(readingLinkByKey.draft)}
                      saving={savingId === "draft"}
                      setToastMessage={setToastMessage}
                    />
                  )}
                  {sortedJobs.map((job) => (
                    <JobRow
                      confirmDelete={confirmDeleteJobId === job.id}
                      errors={fieldErrors[job.id] ?? {}}
                      job={job}
                      key={job.id}
                      linkMessages={linkMessages[job.id] ?? []}
                      onCancelDelete={() => setConfirmDeleteJobId(null)}
                      onChange={(patch) => updateJobLocal(job.id, patch)}
                      onCommit={(patch) => commitJob(job.id, patch)}
                      onConfirmDelete={() => confirmDeleteJob(job.id)}
                      onReadLink={(link) => readLinkFor(job.id, link)}
                      onRefreshSnapshot={refreshSnapshot}
                      onStartDelete={() => setConfirmDeleteJobId(job.id)}
                      platformName={platformNameById.get(job.platformId) ?? "Không rõ Platform"}
                      platforms={platforms}
                      readingLink={Boolean(readingLinkByKey[job.id])}
                      saving={savingId === job.id}
                      setToastMessage={setToastMessage}
                    />
                  ))}
                  {!adding && sortedJobs.length === 0 && (
                    <tr>
                      <td className="job-empty" colSpan={8}>
                        Chưa có job nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function SortableHeader({ label, mark, onClick }: { label: string; mark: string; onClick: () => void }) {
  return (
    <th>
      <button className="job-sort-button" onClick={onClick} type="button">
        <span>{label}</span>
        <span aria-hidden="true">{mark}</span>
      </button>
    </th>
  );
}

function DraftJobRow({
  draft,
  errors,
  linkMessages,
  onCancel,
  onChange,
  onRefreshSnapshot,
  onReadLink,
  onSave,
  platforms,
  readingLink,
  saving,
  setToastMessage
}: {
  draft: JobForm;
  errors: FieldErrors;
  linkMessages: string[];
  onCancel: () => void;
  onChange: (patch: Partial<JobForm>) => void;
  onRefreshSnapshot: () => Promise<JobTrackerSnapshot>;
  onReadLink: (link: string) => void;
  onSave: () => void;
  platforms: JobPlatformEntity[];
  readingLink: boolean;
  saving: boolean;
  setToastMessage: (message: string) => void;
}) {
  return (
    <tr>
      <td>
        <JobTextInput error={errors.company} onChange={(company) => onChange({ company })} value={draft.company} />
      </td>
      <td>
        <JobDateInput error={errors.deadline} onChange={(deadline) => onChange({ deadline })} value={draft.deadline} />
      </td>
      <td>
        <PlatformDropdown
          error={errors.platformId}
          onChange={(platformId) => onChange({ platformId })}
          onRefreshSnapshot={onRefreshSnapshot}
          platforms={platforms}
          setToastMessage={setToastMessage}
          value={draft.platformId}
        />
      </td>
      <td>
        <JobLinkInput
          error={errors.link}
          messages={linkMessages}
          onBlur={onReadLink}
          onChange={(link) => onChange({ link })}
          reading={readingLink}
          value={draft.link}
        />
      </td>
      <td>
        <StatusSelect onChange={(status) => onChange({ status })} value={draft.status} />
      </td>
      <td>-</td>
      <td>
        <JobNoteInput onChange={(note) => onChange({ note })} value={draft.note} />
      </td>
      <td>
        <div className="job-row-actions">
          <button className="icon-button" disabled={saving} onClick={onSave} title="Lưu job" type="button">
            <Check size={16} />
          </button>
          <button className="icon-button" disabled={saving} onClick={onCancel} title="Hủy thêm job" type="button">
            <X size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function JobRow({
  confirmDelete,
  errors,
  job,
  linkMessages,
  onCancelDelete,
  onChange,
  onCommit,
  onConfirmDelete,
  onReadLink,
  onRefreshSnapshot,
  onStartDelete,
  platformName,
  platforms,
  readingLink,
  saving,
  setToastMessage
}: {
  confirmDelete: boolean;
  errors: FieldErrors;
  job: ClientJob;
  linkMessages: string[];
  onCancelDelete: () => void;
  onChange: (patch: Partial<JobForm>) => void;
  onCommit: (patch?: Partial<JobForm>) => void;
  onConfirmDelete: () => void;
  onReadLink: (link: string) => void;
  onRefreshSnapshot: () => Promise<JobTrackerSnapshot>;
  onStartDelete: () => void;
  platformName: string;
  platforms: JobPlatformEntity[];
  readingLink: boolean;
  saving: boolean;
  setToastMessage: (message: string) => void;
}) {
  const form = toJobForm(job);
  return (
    <tr>
      <td>
        <JobTextInput
          error={errors.company}
          onBlur={() => onCommit()}
          onChange={(company) => onChange({ company })}
          value={job.company}
        />
      </td>
      <td>
        <JobDateInput
          error={errors.deadline}
          onBlur={() => onCommit()}
          onChange={(deadline) => onChange({ deadline })}
          title={formatDate(job.deadline)}
          value={form.deadline}
        />
      </td>
      <td>
        <PlatformDropdown
          error={errors.platformId}
          onChange={(platformId) => {
            onChange({ platformId });
            onCommit({ platformId });
          }}
          onRefreshSnapshot={onRefreshSnapshot}
          platforms={platforms}
          selectedLabel={platformName}
          setToastMessage={setToastMessage}
          value={job.platformId}
        />
      </td>
      <td>
        <div className="job-link-cell">
          <JobLinkInput
            error={errors.link}
            messages={linkMessages}
            onBlur={(link) => {
              onCommit();
              onReadLink(link);
            }}
            onChange={(link) => onChange({ link })}
            reading={readingLink}
            value={job.link}
          />
          <a className="icon-button job-link-open" href={job.link} rel="noreferrer" target="_blank" title="Mở link">
            <ExternalLink size={15} />
          </a>
        </div>
      </td>
      <td>
        <StatusSelect
          onChange={(status) => {
            onChange({ status });
            onCommit({ status });
          }}
          value={job.status}
        />
      </td>
      <td>{formatDateTime(job.submittedAt) || "-"}</td>
      <td>
        <JobNoteInput onBlur={() => onCommit()} onChange={(note) => onChange({ note })} value={job.note ?? ""} />
      </td>
      <td>
        {confirmDelete ? (
          <div className="job-confirm-delete">
            <span>Xóa?</span>
            <button className="icon-button danger-inline" disabled={saving} onClick={onConfirmDelete} title="Xác nhận xóa" type="button">
              <Check size={15} />
            </button>
            <button className="icon-button" disabled={saving} onClick={onCancelDelete} title="Hủy xóa" type="button">
              <X size={15} />
            </button>
          </div>
        ) : (
          <button className="icon-button" disabled={saving} onClick={onStartDelete} title="Xóa job" type="button">
            <Trash2 size={16} />
          </button>
        )}
      </td>
    </tr>
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
      <input onBlur={onBlur} onChange={(event) => onChange(event.target.value)} value={value} />
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
      <textarea onBlur={onBlur} onChange={(event) => onChange(event.target.value)} rows={3} value={value} />
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
      <input onBlur={onBlur} onChange={(event) => onChange(event.target.value)} title={title} type="date" value={value} />
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
      <input onBlur={(event) => onBlur?.(event.target.value)} onChange={(event) => onChange(event.target.value)} value={value} />
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
    <select
      className={`job-status-select ${STATUS_CLASS[value]}`}
      onChange={(event) => onChange(event.target.value as JobApplicationStatus)}
      value={value}
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
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
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const currentLabel = selectedLabel ?? platforms.find((platform) => platform.id === value)?.name ?? "Chọn Platform";

  // Menu render qua portal (document.body) nên phải tự tính toạ độ từ nút trigger —
  // đóng khi cuộn/resize thay vì đuổi theo, để tránh vị trí bị lệch (menu ngắn, đủ dùng
  // cho một dropdown chọn/thêm/xóa Platform).
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + 6, left: rect.left });
    }
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

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
      <div className="platform-picker">
        <button
          aria-expanded={open}
          className="platform-trigger"
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          ref={triggerRef}
          type="button"
        >
          <span>{currentLabel}</span>
          <ChevronDown size={16} />
        </button>
        {open &&
          menuPosition &&
          createPortal(
            <>
              <div className="platform-menu-backdrop" onClick={() => setOpen(false)} />
              <div className="platform-menu" style={{ top: menuPosition.top, left: menuPosition.left }}>
                {platforms.map((platform) => (
                  <div className="platform-option" key={platform.id}>
                    <button
                      className={platform.id === value ? "selected" : ""}
                      disabled={busy}
                      onClick={() => {
                        onChange(platform.id);
                        setOpen(false);
                      }}
                      type="button"
                    >
                      {platform.name}
                    </button>
                    <button
                      className="platform-delete"
                      disabled={busy}
                      onClick={(event) => {
                        event.stopPropagation();
                        removePlatform(platform);
                      }}
                      title={`Xóa ${platform.name}`}
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div className="platform-add">
                  <input
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
                  <button
                    className="icon-button"
                    disabled={busy || !newName.trim()}
                    onClick={addPlatform}
                    title="Thêm platform"
                    type="button"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </>,
            document.body
          )}
      </div>
      {error && <span className="job-field-error">{error}</span>}
    </div>
  );
}
