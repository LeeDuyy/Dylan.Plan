"use client";

import { Button, Card, Grid, Progress, Stack, Timeline } from "@vn-dylan/ui";
import { ArrowRight, CalendarDays, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { Panel, SectionHeading, StatCard } from "@/components/shared/blocks";
import { PageEditButton } from "@/components/shared/PageEditButton";
import { PageFrame } from "@/components/shared/PageFrame";
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

// Lưới chuẩn: 2 khối cạnh nhau từ `lg`, các lưới thẻ 1 → 2 → 3/4 cột.
const TWO_COL = { base: 1, lg: 2 };
const CARD_COLS_3 = { base: 1, sm: 2, lg: 3 };
const CARD_COLS_4 = { base: 1, sm: 2, lg: 4 };

export function OverviewView({
  initialJobTracker = EMPTY_JOB_TRACKER,
  phases = DEFAULT_ROADMAP_PHASES
}: {
  initialJobTracker?: JobTrackerSnapshot;
  phases?: RoadmapPhaseView[];
}) {
  const router = useRouter();
  const jobs = initialJobTracker.jobs;
  const activePhase = resolveActivePhase(new Date(), phases);
  const pipelineCards: [string, number, string][] = [
    ["Tổng hồ sơ", jobs.length, "Toàn bộ job đang theo dõi"],
    ...PIPELINE_GROUPS.slice(0, 3).map(
      ([label, statuses, desc]) =>
        [label, jobs.filter((job) => statuses.includes(job.status)).length, desc] as [string, number, string]
    )
  ];

  return (
    <PageFrame
      eyebrow="Career · Buy to Build · Finance"
      title={
        <>
          Kế hoạch <span className="gradient">sự nghiệp, sản phẩm và thu chi</span>
        </>
      }
      description="App hợp nhất kế hoạch chuyển việc, chiến lược Buy to Build, MVP Mini Shop Builder và budget planner có nhập nhanh chi tiêu."
      actions={
        <>
          <Button icon={<WalletCards size={18} />} onClick={() => router.push("/budget/monthly")}>
            Nhập thu chi
          </Button>
          <Button variant="solid" icon={<CalendarDays size={18} />} onClick={() => router.push("/roadmap/timeline")}>
            Xem roadmap
          </Button>
        </>
      }
    >
      {activePhase && (
        <Panel
          eyebrow={`${PHASE_STATE_LABEL[activePhase.state]} · ${activePhase.phase.dateRange}`}
          title={activePhase.phase.label}
          extra={
            <Button
              variant="plain"
              size="sm"
              icon={<ArrowRight size={16} />}
              iconAlignment="end"
              onClick={() => router.push("/roadmap/timeline")}
            >
              Chi tiết roadmap
            </Button>
          }
        >
          <Grid columns={CARD_COLS_3} gap="base">
            {activePhase.phase.deliverables.map((deliverable) => (
              <div className="deliverable" key={deliverable.id}>
                <strong>{deliverable.title}</strong>
              </div>
            ))}
          </Grid>
        </Panel>
      )}

      <Grid columns={CARD_COLS_4} gap="loose">
        {pipelineCards.map(([label, value, desc]) => (
          <StatCard key={label} label={label} value={value} hint={desc} />
        ))}
      </Grid>
    </PageFrame>
  );
}

export function PrioritySection({ content }: { content: PageContentView }) {
  const items = content.blocks.default ?? [];
  return (
    <PageFrame actions={<PageEditButton page="roadmap/priorities" title="Ưu tiên hiện tại" content={content} />}>
      <Grid columns={CARD_COLS_4} gap="loose">
        {items.map((item, index) => (
          <StatCard key={item.id} label={`Ưu tiên ${index + 1}`} value={item.value} hint={item.desc}>
            <h3>{item.title}</h3>
            <Progress percent={item.weight ?? 0} showInfo={false} />
          </StatCard>
        ))}
      </Grid>
    </PageFrame>
  );
}

export function RoadmapTimelineSection({ phases = DEFAULT_ROADMAP_PHASES }: { phases?: RoadmapPhaseView[] }) {
  return (
    <PageFrame>
      <Timeline className="roadmap-timeline">
        {phases.map((phase) => (
          <Timeline.Item key={phase.id}>
            <Stack gap="base" className="roadmap-phase">
              <Stack gap="tight">
                <div className="roadmap-phase-head">
                  <strong>{phase.dateRange}</strong>
                  <span className="muted">{phase.label}</span>
                </div>
                <h3>{phase.title}</h3>
                <p className="muted">{phase.desc}</p>
              </Stack>
              <Grid columns={CARD_COLS_3} gap="base">
                {phase.deliverables.map((deliverable) => (
                  <div className="deliverable" key={deliverable.id}>
                    <strong>{deliverable.title}</strong>
                    <span className="muted">{deliverable.desc}</span>
                  </div>
                ))}
              </Grid>
            </Stack>
          </Timeline.Item>
        ))}
      </Timeline>
    </PageFrame>
  );
}

export function FirstWeekSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default.map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <PageFrame actions={<PageEditButton page="roadmap/first-week" title="Kế hoạch tuần đầu" content={content} />}>
      <TargetGrid items={items} />
    </PageFrame>
  );
}

export function WeeklyKpiSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default.map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <PageFrame actions={<PageEditButton page="roadmap/weekly-kpi" title="KPI hằng tuần" content={content} />}>
      <TargetGrid items={items} />
    </PageFrame>
  );
}

export function FreelanceStrategySection({ content }: { content: PageContentView }) {
  const t = content.texts;
  const ratioRows = content.blocks.ratio ?? [];
  const principleItems = (content.blocks.principles ?? []).map((item) => [item.badge ?? "", item.title ?? "", item.desc ?? ""]);
  const services = content.blocks.services ?? [];
  return (
    <PageFrame actions={<PageEditButton page="freelance/strategy" title="Chiến lược Buy to Build" content={content} />}>
      <Grid columns={TWO_COL} gap="loose">
        <Panel eyebrow={t["ratio.eyebrow"]} title={t["ratio.title"]}>
          <p className="muted">{t["ratio.desc"]}</p>
          <Progress percent={Number(t["ratio.percent"]) || 0} showInfo={false} strokeClass="progress-warn" />
          <div className="ratio-labels">
            {ratioRows.map((row) => (
              <div key={row.id}>
                <strong>{row.title}</strong>
                {row.desc}
              </div>
            ))}
          </div>
        </Panel>
        <Panel eyebrow={t["principles.eyebrow"]} title={t["principles.title"]}>
          <TopicList items={principleItems} />
        </Panel>
      </Grid>
      <Grid columns={CARD_COLS_3} gap="loose">
        {services.map((item) => (
          <InfoCard key={item.id} badge={item.badge} title={item.title} desc={item.desc}>
            <Stack gap="tight">
              {(item.bullets ?? []).map((bullet) => (
                <span className="service-meta-item" key={bullet}>
                  {bullet}
                </span>
              ))}
            </Stack>
          </InfoCard>
        ))}
      </Grid>
    </PageFrame>
  );
}

export function FreelanceProcessSection({ content }: { content: PageContentView }) {
  const t = content.texts;
  const flowItems = content.blocks.flow ?? [];
  const acceptItems = (content.blocks.accept ?? []).map((item) => item.desc ?? "");
  const rejectItems = (content.blocks.reject ?? []).map((item) => item.desc ?? "");
  return (
    <PageFrame actions={<PageEditButton page="freelance/process" title="Quy trình & bộ lọc dự án" content={content} />}>
      <Grid columns={{ base: 1, sm: 2, lg: 5 }} gap="base">
        {flowItems.map((item) => (
          <div className="flow-step" key={item.id}>
            <b>{item.badge}</b>
            <strong>{item.title}</strong>
            <span>{item.desc}</span>
          </div>
        ))}
      </Grid>

      <Stack gap="base">
        <SectionHeading eyebrow={t["gate.eyebrow"]} title={t["gate.title"]} desc={t["gate.desc"]} />
        <Grid columns={TWO_COL} gap="loose">
          <DecisionPanel tone="accept" title={t["gate.acceptTitle"]} items={acceptItems} />
          <DecisionPanel tone="reject" title={t["gate.rejectTitle"]} items={rejectItems} />
        </Grid>
      </Stack>
    </PageFrame>
  );
}

export function FreelanceKpiSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default.map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <PageFrame actions={<PageEditButton page="freelance/kpi" title="KPI theo tuần" content={content} />}>
      <TargetGrid items={items} />
    </PageFrame>
  );
}

export function ProductPositioningSection({ content }: { content: PageContentView }) {
  const t = content.texts;
  const stackItems = content.blocks.stack ?? [];
  const principleItems = (content.blocks.principles ?? []).map((item) => [item.badge ?? "", item.title ?? "", item.desc ?? ""]);
  return (
    <PageFrame actions={<PageEditButton page="product/positioning" title="Định vị MVP" content={content} />}>
      <Grid columns={TWO_COL} gap="loose">
        <Panel eyebrow={t["stack.eyebrow"]} title={t["stack.title"]}>
          <Stack gap="tight">
            {stackItems.map((item) => (
              <div className="stack-row" key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </div>
            ))}
          </Stack>
        </Panel>
        <Panel eyebrow={t["principles.eyebrow"]} title={t["principles.title"]}>
          <TopicList items={principleItems} />
        </Panel>
      </Grid>
    </PageFrame>
  );
}

export function ProductScopeSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default ?? [];
  return (
    <PageFrame actions={<PageEditButton page="product/scope" title="Module cần có" content={content} />}>
      <Grid columns={CARD_COLS_4} gap="loose">
        {items.map((item) => (
          <InfoCard key={item.id} badge={item.badge} title={item.title} desc={item.desc} />
        ))}
      </Grid>
    </PageFrame>
  );
}

export function ProductTimelineSection({ content }: { content: PageContentView }) {
  const weeks = content.blocks.default ?? [];
  return (
    <PageFrame actions={<PageEditButton page="product/timeline" title="Lộ trình 8 tuần" content={content} />}>
      <Grid columns={CARD_COLS_4} gap="loose">
        {weeks.map((week) => (
          <InfoCard key={week.id} badge={week.badge} title={week.title}>
            <ul className="bullet-list">
              {(week.bullets ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </InfoCard>
        ))}
      </Grid>
    </PageFrame>
  );
}

export function ProductKpiSection({ content }: { content: PageContentView }) {
  const items = content.blocks.default.map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <PageFrame actions={<PageEditButton page="product/kpi" title="KPI sản phẩm" content={content} />}>
      <TargetGrid items={items} />
    </PageFrame>
  );
}

export function LongTermSections({ content }: { content: PageContentView }) {
  const t = content.texts;
  const incomeRows = content.blocks.income ?? [];
  const scenarioRows = content.blocks.scenarios ?? [];
  const riskItems = (content.blocks.risk ?? []).map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <PageFrame actions={<PageEditButton page="roadmap/long-term" title="Kế hoạch dài hạn" content={content} />}>
      <Grid columns={TWO_COL} gap="loose">
        <Panel eyebrow={t["income.eyebrow"]}>
          <div className="income-total">{t["income.total"]}</div>
          <p className="muted">{t["income.desc"]}</p>
          <Stack gap="tight">
            {incomeRows.map((row) => (
              <div className="income-row" key={row.id}>
                <strong>{row.title}</strong>
                <Progress percent={row.weight ?? 0} showInfo={false} strokeClass={row.variant || undefined} />
                <span>{row.value}</span>
              </div>
            ))}
          </Stack>
        </Panel>
        <Panel eyebrow={t["scenarios.eyebrow"]} title={t["scenarios.title"]}>
          <Stack gap="tight">
            {scenarioRows.map((row) => (
              <div className="scenario-card" key={row.id}>
                <span className="eyebrow">{row.title}</span>
                <strong>{row.value}</strong>
                <p>{row.desc}</p>
              </div>
            ))}
          </Stack>
        </Panel>
      </Grid>
      <TargetGrid eyebrow={t["risk.eyebrow"]} title={t["risk.title"]} desc={t["risk.desc"]} items={riskItems} />
    </PageFrame>
  );
}

export function TimetableSection({ rows = DEFAULT_TIMETABLE_ROWS }: { rows?: TimetableRowView[] }) {
  return (
    <PageFrame>
      <Panel>
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
      </Panel>
    </PageFrame>
  );
}

export function EnglishInterviewSections({ content }: { content: PageContentView }) {
  const t = content.texts;
  const topicItems = (content.blocks.topics ?? []).map((item) => [item.badge ?? "", item.title ?? "", item.desc ?? ""]);
  const roundItems = content.blocks.rounds ?? [];
  const scorecardItems = (content.blocks.scorecard ?? []).map((item) => [item.value ?? "", item.desc ?? ""]);
  return (
    <PageFrame actions={<PageEditButton page="roadmap/english" title="Tiếng Anh & Phỏng vấn" content={content} />}>
      <Grid columns={TWO_COL} gap="loose">
        <Panel eyebrow={t["topics.eyebrow"]} title={t["topics.title"]}>
          <TopicList items={topicItems} />
        </Panel>
        <Panel eyebrow={t["rounds.eyebrow"]} title={t["rounds.title"]}>
          <Grid columns={{ base: 1, sm: 2 }} gap="tight">
            {roundItems.map((item, index) => (
              <div className="round" key={item.id}>
                <small>VÒNG {index + 1}</small>
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </div>
            ))}
          </Grid>
        </Panel>
      </Grid>
      <TargetGrid eyebrow={t["scorecard.eyebrow"]} title={t["scorecard.title"]} desc={t["scorecard.desc"]} items={scorecardItems} />
    </PageFrame>
  );
}

// Thẻ nội dung gọn: nhãn nhỏ + tiêu đề + mô tả, phần mở rộng (gạch đầu dòng...) bên dưới.
function InfoCard({ badge, title, desc, children }: { badge?: string; title?: string; desc?: string; children?: ReactNode }) {
  return (
    <Card padding="compact" className="info-card">
      <Stack gap="tight">
        {badge && <span className="eyebrow">{badge}</span>}
        {title && <h3>{title}</h3>}
        {desc && <p className="muted">{desc}</p>}
        {children}
      </Stack>
    </Card>
  );
}

function TopicList({ items }: { items: string[][] }) {
  return (
    <Stack gap="tight">
      {items.map(([badge, title, desc]) => (
        <div className="topic" key={`${badge}-${title}`}>
          <b>{badge}</b>
          <div>
            <strong>{title}</strong>
            <span>{desc}</span>
          </div>
        </div>
      ))}
    </Stack>
  );
}

function DecisionPanel({ tone, title, items }: { tone: "accept" | "reject"; title: string; items: string[] }) {
  return (
    <Panel eyebrow={<span className={tone}>{title}</span>}>
      <Stack gap="tight">
        {items.map((item) => (
          <div className="decision-item" key={item}>
            <span className={tone}>{tone === "accept" ? "✓" : "×"}</span>
            <span>{item}</span>
          </div>
        ))}
      </Stack>
    </Panel>
  );
}
