"use client";

import { Button, Card, Progress, Timeline } from "@vn-dylan/ui";
import { CalendarDays, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";

import { PageEditButton } from "@/components/shared/PageEditButton";
import { TargetGrid } from "@/components/shared/TargetGrid";
import type { PageContentView } from "@/lib/page-content-defaults";
import {
  DEFAULT_ROADMAP_PHASES,
  PHASE_STATE_LABEL,
  resolveActivePhase,
  type RoadmapPhaseView
} from "@/lib/roadmap-defaults";
import {
  DEFAULT_TIMETABLE_ROWS,
  scheduleClass,
  TIMETABLE_DAY_HEADERS,
  TIMETABLE_DAY_KEYS,
  type TimetableRowView
} from "@/lib/timetable-defaults";
import type { JobApplicationStatus, JobTrackerSnapshot } from "@/server/job-tracker/actions";

const EMPTY_JOB_TRACKER: JobTrackerSnapshot = { jobs: [], platforms: [] };

// Nhóm trạng thái ứng tuyển thành phễu ngắn gọn cho phần Tổng quan.
const PIPELINE_GROUPS: [string, JobApplicationStatus[], string][] = [
  ["Quan tâm", ["Interested"], "Chưa nộp, đang cân nhắc"],
  ["Đang chờ phản hồi", ["Waiting", "No Response"], "Đã nộp, chưa có kết quả"],
  ["Đang tiến triển", ["Response", "Appointment"], "Có phản hồi hoặc đã hẹn phỏng vấn"],
  ["Đã đóng", ["Cancel", "Fail", "Expired"], "Bị hủy, trượt hoặc hết hạn"]
];

export function HeroSection() {
  const router = useRouter();
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-main">
          <span className="eyebrow">Career · Buy to Build · Finance</span>
          <h1>
            Kế hoạch <span className="gradient">sự nghiệp, sản phẩm và thu chi</span>
          </h1>
          <p className="lead">
            App hợp nhất kế hoạch chuyển việc, chiến lược Buy to Build, MVP Mini Shop Builder và budget planner có
            nhập nhanh chi tiêu.
          </p>
          <div className="hero-actions">
            <Button variant="solid" icon={<CalendarDays size={18} />} onClick={() => router.push("/roadmap/timeline")}>
              Xem roadmap
            </Button>
            <Button icon={<WalletCards size={18} />} onClick={() => router.push("/budget/monthly")}>
              Nhập thu chi
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CurrentStatusSection({
  initialJobTracker = EMPTY_JOB_TRACKER,
  phases = DEFAULT_ROADMAP_PHASES
}: {
  initialJobTracker?: JobTrackerSnapshot;
  phases?: RoadmapPhaseView[];
}) {
  const router = useRouter();
  const jobs = initialJobTracker.jobs;
  const activePhase = resolveActivePhase(new Date(), phases);
  const pipelineCards: [string, string, string][] = [
    ["Tổng hồ sơ", String(jobs.length), "Toàn bộ job đang theo dõi"],
    ...PIPELINE_GROUPS.slice(0, 3).map(
      ([label, statuses, desc]) =>
        [label, String(jobs.filter((job) => statuses.includes(job.status)).length), desc] as [string, string, string]
    )
  ];

  return (
    <section className="section" id="overview">
      <div className="container">
        {activePhase && (
          <Card className="panel overview-phase">
            <span className="eyebrow">
              {PHASE_STATE_LABEL[activePhase.state]} · {activePhase.phase.dateRange}
            </span>
            <h3>{activePhase.phase.label}</h3>
            <div className="deliverables">
              {activePhase.phase.deliverables.map((deliverable) => (
                <div className="deliverable" key={deliverable.id}>
                  <strong>{deliverable.title}</strong>
                </div>
              ))}
            </div>
            <Button icon={<CalendarDays size={18} />} onClick={() => router.push("/roadmap/timeline")}>
              Xem chi tiết roadmap
            </Button>
          </Card>
        )}

        <div className="overview-pipeline summary-grid">
          {pipelineCards.map(([label, value, desc]) => (
            <Card key={label} className="summary">
              <span className="eyebrow">{label}</span>
              <div className="value">{value}</div>
              <p>{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PrioritySection({ content }: { content: PageContentView }) {
  const items = content.blocks.default ?? [];
  return (
    <>
      <PageEditButton page="roadmap/priorities" title="Ưu tiên hiện tại" content={content} />
      <section className="section" id="strategy">
        <div className="container">
          <div className="priority-grid">
            {items.map((item, index) => (
              <Card key={item.id} className="priority">
                <span className="eyebrow">Ưu tiên {index + 1}</span>
                <div className="percent">{item.value}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <Progress className="priority-bar" percent={item.weight ?? 0} showInfo={false} />
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function RoadmapTimelineSection({ phases = DEFAULT_ROADMAP_PHASES }: { phases?: RoadmapPhaseView[] }) {
  return (
    <section className="section" id="roadmap">
      <div className="container">
        <Timeline className="roadmap-timeline">
          {phases.map((phase) => (
            <Timeline.Item key={phase.id}>
              <div className="roadmap-phase">
                <div className="roadmap-phase-head">
                  <strong>{phase.dateRange}</strong>
                  <span className="muted">{phase.label}</span>
                </div>
                <h3>{phase.title}</h3>
                <p>{phase.desc}</p>
                <div className="deliverables">
                  {phase.deliverables.map((deliverable) => (
                    <div className="deliverable" key={deliverable.id}>
                      <strong>{deliverable.title}</strong>
                      <span className="muted">{deliverable.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </section>
  );
}

export function FirstWeekSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default.map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <>
      <PageEditButton page="roadmap/first-week" title="Kế hoạch tuần đầu" content={content} />
      <TargetGrid headless items={items} />
    </>
  );
}

export function WeeklyKpiSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default.map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <>
      <PageEditButton page="roadmap/weekly-kpi" title="KPI hằng tuần" content={content} />
      <TargetGrid headless items={items} />
    </>
  );
}

export function FreelanceStrategySection({ content }: { content: PageContentView }) {
  const t = content.texts;
  const ratioRows = content.blocks.ratio ?? [];
  const principleItems = (content.blocks.principles ?? []).map((item) => [item.badge ?? "", item.title ?? "", item.desc ?? ""]);
  const services = content.blocks.services ?? [];
  return (
    <>
      <PageEditButton page="freelance/strategy" title="Chiến lược Buy to Build" content={content} />
      <section className="section" id="freelance">
        <div className="container">
          <div className="freelance-strategy">
            <Card className="panel">
              <span className="eyebrow">{t["ratio.eyebrow"]}</span>
              <h3>{t["ratio.title"]}</h3>
              <p className="muted">{t["ratio.desc"]}</p>
              <Progress
                className="hybrid-ratio"
                percent={Number(t["ratio.percent"]) || 0}
                showInfo={false}
                strokeClass="progress-warn"
              />
              <div className="ratio-labels">
                {ratioRows.map((row) => (
                  <div key={row.id}>
                    <strong>{row.title}</strong>
                    {row.desc}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="panel">
              <span className="eyebrow">{t["principles.eyebrow"]}</span>
              <h3>{t["principles.title"]}</h3>
              <TopicList items={principleItems} />
            </Card>
          </div>
          <div className="service-grid">
            {services.map((item) => (
              <Card key={item.id} className="service-card">
                <small>{item.badge}</small>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="service-meta">
                  {(item.bullets ?? []).map((bullet) => (
                    <span key={bullet}>{bullet}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function FreelanceProcessSection({ content }: { content: PageContentView }) {
  const t = content.texts;
  const flowItems = content.blocks.flow ?? [];
  const acceptItems = (content.blocks.accept ?? []).map((item) => item.desc ?? "");
  const rejectItems = (content.blocks.reject ?? []).map((item) => item.desc ?? "");
  return (
    <>
      <PageEditButton page="freelance/process" title="Quy trình & bộ lọc dự án" content={content} />
      <section className="section">
        <div className="container">
          <div className="flow-grid">
            {flowItems.map((item) => (
              <div className="flow-step" key={item.id}>
                <b>{item.badge}</b>
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GateSection
        eyebrow={t["gate.eyebrow"]}
        title={t["gate.title"]}
        desc={t["gate.desc"]}
        acceptTitle={t["gate.acceptTitle"]}
        rejectTitle={t["gate.rejectTitle"]}
        acceptItems={acceptItems}
        rejectItems={rejectItems}
      />
    </>
  );
}

export function FreelanceKpiSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default.map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <>
      <PageEditButton page="freelance/kpi" title="KPI theo tuần" content={content} />
      <TargetGrid headless items={items} />
    </>
  );
}

export function ProductPositioningSection({ content }: { content: PageContentView }) {
  const t = content.texts;
  const stackItems = content.blocks.stack ?? [];
  const principleItems = (content.blocks.principles ?? []).map((item) => [item.badge ?? "", item.title ?? "", item.desc ?? ""]);
  return (
    <>
      <PageEditButton page="product/positioning" title="Định vị MVP" content={content} />
      <section className="section" id="personal-product">
        <div className="container">
          <div className="two-col">
            <Card className="panel">
              <span className="eyebrow">{t["stack.eyebrow"]}</span>
              <h3>{t["stack.title"]}</h3>
              <div className="stack-list">
                {stackItems.map((item) => (
                  <div className="stack-row" key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="panel">
              <span className="eyebrow">{t["principles.eyebrow"]}</span>
              <h3>{t["principles.title"]}</h3>
              <TopicList items={principleItems} />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

export function ProductScopeSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default ?? [];
  return (
    <>
      <PageEditButton page="product/scope" title="Module cần có" content={content} />
      <section className="section">
        <div className="container">
          <div className="module-grid">
            {items.map((item) => (
              <Card key={item.id} className="module-card">
                <small>{item.badge}</small>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ProductTimelineSection({ content }: { content: PageContentView }) {
  const weeks = content.blocks.default ?? [];
  return (
    <>
      <PageEditButton page="product/timeline" title="Lộ trình 8 tuần" content={content} />
      <section className="section">
        <div className="container">
          <div className="product-roadmap">
            {weeks.map((week) => (
              <Card key={week.id} className="product-week">
                <small>{week.badge}</small>
                <h3>{week.title}</h3>
                <ul>
                  {(week.bullets ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ProductKpiSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default.map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <>
      <PageEditButton page="product/kpi" title="KPI sản phẩm" content={content} />
      <TargetGrid headless items={items} />
    </>
  );
}

export function LongTermSections({ content }: { content: PageContentView }) {
  const t = content.texts;
  const incomeRows = content.blocks.income ?? [];
  const scenarioRows = content.blocks.scenarios ?? [];
  const riskItems = (content.blocks.risk ?? []).map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <>
      <PageEditButton page="roadmap/long-term" title="Kế hoạch dài hạn" content={content} />
      <section className="section" id="long-term">
        <div className="container">
          <div className="two-col">
            <Card className="panel">
              <span className="eyebrow">{t["income.eyebrow"]}</span>
              <div className="income-total">{t["income.total"]}</div>
              <p className="muted">{t["income.desc"]}</p>
              <div className="income-breakdown">
                {incomeRows.map((row) => (
                  <div className="income-row" key={row.id}>
                    <strong>{row.title}</strong>
                    <Progress
                      className="income-track"
                      percent={row.weight ?? 0}
                      showInfo={false}
                      strokeClass={row.variant || undefined}
                    />
                    <span>{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="panel">
              <span className="eyebrow">{t["scenarios.eyebrow"]}</span>
              <h3>{t["scenarios.title"]}</h3>
              <div className="scenario-list">
                {scenarioRows.map((row) => (
                  <div className="scenario-card" key={row.id}>
                    <span className="eyebrow">{row.title}</span>
                    <strong>{row.value}</strong>
                    <p>{row.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
      <TargetGrid eyebrow={t["risk.eyebrow"]} title={t["risk.title"]} desc={t["risk.desc"]} items={riskItems} />
    </>
  );
}

export function TimetableSection({ rows = DEFAULT_TIMETABLE_ROWS }: { rows?: TimetableRowView[] }) {
  return (
    <section className="section" id="timetable">
      <div className="container">
        <Card className="panel">
          <div className="schedule">
            <div className="cell head">Khung giờ</div>
            {TIMETABLE_DAY_KEYS.map((dayKey) => (
              <div className="cell head" key={dayKey}>
                {TIMETABLE_DAY_HEADERS[dayKey]}
              </div>
            ))}
            {rows.flatMap((row) => [
              <div className="cell time" key={`${row.id}-time`}>
                {row.timeLabel}
              </div>,
              ...TIMETABLE_DAY_KEYS.map((dayKey) => {
                const item = row[dayKey];
                return (
                  <div className={`cell ${scheduleClass(item)}`} key={`${row.id}-${dayKey}`}>
                    {item}
                  </div>
                );
              })
            ])}
          </div>
          <div className="legend">
            <span style={{ "--legend-color": "var(--blue)" } as React.CSSProperties}>Tiếng Anh</span>
            <span style={{ "--legend-color": "var(--primary)" } as React.CSSProperties}>Phỏng vấn/kỹ thuật</span>
            <span style={{ "--legend-color": "var(--success)" } as React.CSSProperties}>Sản phẩm</span>
            <span style={{ "--legend-color": "var(--warning)" } as React.CSSProperties}>Freelance/portfolio</span>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function EnglishInterviewSections({ content }: { content: PageContentView }) {
  const t = content.texts;
  const topicItems = (content.blocks.topics ?? []).map((item) => [item.badge ?? "", item.title ?? "", item.desc ?? ""]);
  const roundItems = content.blocks.rounds ?? [];
  const scorecardItems = (content.blocks.scorecard ?? []).map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <>
      <PageEditButton page="roadmap/english" title="Tiếng Anh & Phỏng vấn" content={content} />
      <section className="section" id="english">
        <div className="container two-col">
          <Card className="panel">
            <span className="eyebrow">{t["topics.eyebrow"]}</span>
            <h2>{t["topics.title"]}</h2>
            <TopicList items={topicItems} />
          </Card>
          <Card className="panel">
            <span className="eyebrow">{t["rounds.eyebrow"]}</span>
            <h2>{t["rounds.title"]}</h2>
            <div className="round-grid">
              {roundItems.map((item, index) => (
                <div className="round" key={item.id}>
                  <small>VÒNG {index + 1}</small>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
      <TargetGrid eyebrow={t["scorecard.eyebrow"]} title={t["scorecard.title"]} desc={t["scorecard.desc"]} items={scorecardItems} />
    </>
  );
}

function TopicList({ items }: { items: string[][] }) {
  return (
    <div className="topic-list">
      {items.map(([badge, title, desc]) => (
        <div className="topic" key={`${badge}-${title}`}>
          <b>{badge}</b>
          <div>
            <strong>{title}</strong>
            <span>{desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function GateSection({
  eyebrow,
  title,
  desc,
  acceptTitle,
  rejectTitle,
  acceptItems,
  rejectItems
}: {
  eyebrow: string;
  title: string;
  desc: string;
  acceptTitle: string;
  rejectTitle: string;
  acceptItems: string[];
  rejectItems: string[];
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <p>{desc}</p>
        </div>
        <div className="decision-grid">
          <Card className="panel">
            <span className="eyebrow accept">{acceptTitle}</span>
            <div className="decision-list">
              {acceptItems.map((item) => (
                <div className="decision-item" key={item}>
                  <span className="accept">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="panel">
            <span className="eyebrow reject">{rejectTitle}</span>
            <div className="decision-list">
              {rejectItems.map((item) => (
                <div className="decision-item" key={item}>
                  <span className="reject">×</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
