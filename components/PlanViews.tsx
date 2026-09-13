"use client";

import { Button, Card, Progress, Timeline } from "@vn-dylan/ui";
import { CalendarDays, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";

import { TargetGrid } from "@/components/shared/TargetGrid";
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

const priorities = [
  ["Chuyển việc", "55%", "CV, hồ sơ, networking, ứng tuyển, mock interview và xử lý offer.", 100],
  ["Tiếng Anh", "30%", "Giao tiếp nghề nghiệp, tự giới thiệu, kể dự án và trả lời phỏng vấn.", 67],
  ["Sản phẩm", "10%", "Xây base template và module có thể tái sử dụng cho khách freelance.", 34],
  ["Freelance", "5%", "Chỉ tìm lead, demo, báo giá mẫu; chưa ưu tiên nhận dự án delivery thật trước khi có offer.", 23]
] as const;

const firstWeekTargets = [
  ["CV", "Hoàn tất bản CV tiếng Việt + outline CV tiếng Anh"],
  ["LinkedIn", "Cập nhật headline, about và 3 project highlights"],
  ["5 buổi", "English speaking 20-30 phút, ưu tiên self-intro và project story"],
  ["2 stories", "Viết 2 câu chuyện STAR: technical challenge và leadership"],
  ["1 design", "Ôn và trình bày 1 system design từ dự án thật"],
  ["10 công ty", "Lập danh sách công ty mục tiêu và lý do phù hợp"],
  ["0 delivery", "Không nhận freelance delivery trong tuần đầu"],
  ["CN", "Chấm scorecard và điều chỉnh lịch tuần sau"]
];

const weeklyKpis = [
  ["5", "Buổi English speaking ngắn mỗi tuần"],
  ["2", "Buổi mock/review phỏng vấn mỗi tuần"],
  ["2", "Case system design hoặc technical story mỗi tuần"],
  ["1", "Cập nhật CV/LinkedIn/pipeline mỗi tuần"],
  ["30", "Công ty mục tiêu được nghiên cứu trước 15/08"],
  ["20-28", "Hồ sơ chất lượng trong chiến dịch 15/08-15/09"],
  ["5-8", "Quy trình phỏng vấn chuyên môn kỳ vọng"],
  ["1-2", "Offer để so sánh và thương lượng"]
];

const freelanceServices = [
  ["GÓI 01 · ENTRY", "Landing Page", "Dành cho shop cần trang giới thiệu, chạy quảng cáo và nhận liên hệ.", ["1 template responsive", "CTA Zalo / Facebook", "SEO và deploy cơ bản", "Thời gian: 3-5 ngày"]],
  ["GÓI 02 · CORE", "Website bán hàng", "Website sản phẩm, giỏ hàng COD và admin quản lý nội dung.", ["Catalog và chi tiết sản phẩm", "Giỏ hàng và đặt hàng", "Admin sản phẩm / đơn hàng", "Thời gian: 7-10 ngày nếu dùng template"]],
  ["GÓI 03 · SCOPE RÕ", "Admin nội bộ nhỏ", "Chuyển quy trình Excel thủ công thành hệ thống quản lý gọn nhẹ.", ["Đơn hàng và khách hàng", "Dashboard cơ bản", "Import / export Excel", "Chỉ nhận khi scope rõ"]]
] as const;

const productWeeks = [
  ["W1 · 22/06-28/06", "Đóng scope", ["Chọn niche đầu tiên: shop vòng đá/handmade.", "Vẽ sitemap và user flow mua hàng.", "Chốt 1 template UI chính.", "Output: Product brief 1 trang."]],
  ["W2 · 29/06-05/07", "Public demo", ["Làm landing page + catalog tĩnh.", "Chuẩn bị ảnh, nội dung, CTA.", "Deploy bản demo đầu tiên.", "Output: Link demo có thể gửi khách."]],
  ["W3 · 06/07-12/07", "Catalog động", ["Thiết kế entity Product, Category, Image.", "Làm API và màn admin sản phẩm cơ bản.", "Hiển thị dữ liệu thật trên public site.", "Output: CRUD sản phẩm dùng được."]],
  ["W4 · 13/07-19/07", "Order MVP", ["Form đặt hàng/quan tâm sản phẩm.", "Admin xem và đổi trạng thái đơn.", "Thông báo đơn mới qua email/Zalo manual.", "Output: Flow đặt hàng end-to-end."]],
  ["W5 · 20/07-26/07", "Theme config", ["Tách logo, màu, banner, social link thành config.", "Chuẩn hóa seed data cho shop mới.", "Viết checklist clone website.", "Output: Clone được trong 1 ngày."]],
  ["W6 · 27/07-02/08", "Case study", ["Viết case study: vấn đề, giải pháp, màn hình, thời gian triển khai.", "Tạo bảng báo giá 3 gói.", "Chuẩn bị demo script 5 phút.", "Output: Portfolio dùng cho freelance."]],
  ["W7 · 03/08-09/08", "Validate", ["Gửi demo cho 5-10 shop/người quen.", "Ghi lại câu hỏi và objection.", "Không sửa theo từng người ngay.", "Output: Danh sách pattern nhu cầu."]],
  ["W8 · 10/08-14/08", "Freeze trước apply", ["Chỉ fix bug, không thêm feature lớn.", "Chọn 1-2 phần có thể reuse cao nhất.", "Đóng gói demo để phục vụ phỏng vấn/portfolio.", "Output: MVP ổn định trước chiến dịch apply."]]
] as const;

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

export function PrioritySection() {
  return (
    <section className="section" id="strategy">
      <div className="container">
        <div className="priority-grid">
          {priorities.map(([title, percent, desc, width], index) => (
            <Card key={title} className="priority">
              <span className="eyebrow">Ưu tiên {index + 1}</span>
              <div className="percent">{percent}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <Progress className="priority-bar" percent={width} showInfo={false} />
            </Card>
          ))}
        </div>
      </div>
    </section>
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

export function FirstWeekSection() {
  return <TargetGrid headless items={firstWeekTargets} />;
}

export function WeeklyKpiSection() {
  return <TargetGrid headless items={weeklyKpis} />;
}

export function FreelanceStrategySection() {
  return (
    <>
      <section className="section" id="freelance">
        <div className="container">
          <div className="freelance-strategy">
            <Card className="panel">
              <span className="eyebrow">Chiến lược chính</span>
              <h3>80% Buy to Build · 20% Build to Buy</h3>
              <p className="muted">Ưu tiên lead, demo, báo giá và delivery nhỏ; chỉ refactor phần đã có tín hiệu lặp lại.</p>
              <Progress className="hybrid-ratio" percent={80} showInfo={false} strokeClass="progress-warn" />
              <div className="ratio-labels">
                <div>
                  <strong>80% Buy to Build</strong>
                  Lead, demo, báo giá, delivery nhỏ
                </div>
                <div>
                  <strong>20% Build to Buy</strong>
                  Refactor, config, module dùng chung
                </div>
              </div>
            </Card>
            <Card className="panel">
              <span className="eyebrow">Nguyên tắc</span>
              <h3>Không build khi chưa có tín hiệu mua</h3>
              <TopicList
                items={[
                  ["1", "Bán kết quả, không bán giờ", "Scope, giá, milestone và số lần sửa phải đóng gói từ đầu."],
                  ["2", "Reuse tối thiểu 80%", "Chỉ nhận việc có thể dùng lại template/admin/module hiện có."],
                  ["3", "Platform hóa sau khi lặp lại", "Một feature nên xuất hiện ở ít nhất 2-3 khách hàng trước khi đưa vào core."]
                ]}
              />
            </Card>
          </div>
          <div className="service-grid">
            {freelanceServices.map(([code, title, desc, items]) => (
              <Card key={title} className="service-card">
                <small>{code}</small>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="service-meta">
                  {items.map((item) => (
                    <span key={item}>{item}</span>
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

export function FreelanceProcessSection() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="flow-grid">
            {[
              ["1", "Tìm lead", "Người quen, Facebook, shop handmade và phụ kiện."],
              ["2", "Demo", "Cho khách xem template thật thay vì giải thích công nghệ."],
              ["3", "Chốt scope", "Đầu ra, số lần sửa, milestone, phí setup và phí duy trì."],
              ["4", "Delivery nhỏ", "Chỉ triển khai nếu hoàn thành được trong 3-10 ngày và reuse cao."],
              ["5", "Product hóa", "Đưa yêu cầu lặp lại thành config, template hoặc module dùng chung."]
            ].map(([step, title, desc]) => (
              <div className="flow-step" key={step}>
                <b>{step}</b>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GateSection
        eyebrow="Bộ lọc dự án"
        title="Nhận hay từ chối"
        desc="Áp dụng bộ lọc này trước khi báo giá để tránh biến freelance thành công việc toàn thời gian thứ hai."
        acceptTitle="Nên nhận"
        rejectTitle="Nên từ chối"
        acceptItems={[
          "Scope rõ, ít thay đổi và hoàn thành trong 3-10 ngày.",
          "Có thể reuse template, admin hoặc module hiện có.",
          "Khách chấp nhận quy trình, milestone và giới hạn số lần sửa.",
          "Dự án tạo case study, testimonial hoặc insight lặp lại cho sản phẩm."
        ]}
        rejectItems={[
          "Deadline gấp, cần hỗ trợ liên tục hoặc họp quá nhiều.",
          "Custom sâu, workflow phức tạp hoặc không liên quan đến nhóm shop mục tiêu.",
          "Khách chưa rõ yêu cầu nhưng muốn báo giá cố định ngay.",
          "Ảnh hưởng lịch học tiếng Anh, mock interview hoặc công việc chính."
        ]}
      />
    </>
  );
}

export function FreelanceKpiSection() {
  return (
    <TargetGrid
      headless
      items={[
        ["3-5", "Lead phù hợp được tiếp cận"],
        ["1-2", "Cuộc trao đổi nhu cầu"],
        ["1", "Demo hoặc báo giá mẫu gửi đi"],
        ["1", "Pattern/insight được ghi lại"],
        ["≥ 80%", "Tỷ lệ code/template có thể tái sử dụng"],
        ["≤ 4h", "Thời gian freelance mỗi tuần trước offer"]
      ]}
    />
  );
}

export function ProductPositioningSection() {
  return (
      <section className="section" id="personal-product">
        <div className="container">
          <div className="two-col">
            <Card className="panel">
              <span className="eyebrow">Định vị MVP</span>
              <h3>Mini Shop Builder cho shop nhỏ</h3>
              <div className="stack-list">
                {[
                  ["Khách mục tiêu", "Shop handmade, vòng đá, phụ kiện, mỹ phẩm nhỏ, local brand mới bắt đầu."],
                  ["Vấn đề", "Shop cần website riêng để tăng độ tin cậy nhưng không đủ ngân sách làm hệ thống custom."],
                  ["Giải pháp", "Template đẹp + admin đơn giản + deploy nhanh + phí setup/bảo trì rõ ràng."],
                  ["Không làm vội", "Thanh toán online, đa tenant phức tạp, subscription automation, marketplace plugin."]
                ].map(([title, desc]) => (
                  <div className="stack-row" key={title}>
                    <strong>{title}</strong>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="panel">
              <span className="eyebrow">Nguyên tắc build</span>
              <h3>Build nhỏ, dùng được ngay</h3>
              <TopicList
                items={[
                  ["1", "Ưu tiên demo thật", "Website đầu tiên nên phục vụ shop/vòng đá của bạn để có dữ liệu thật và hình ảnh thật."],
                  ["2", "Config trước custom", "Màu, logo, banner, danh mục, sản phẩm, CTA chỉnh bằng config/admin thay vì sửa code."],
                  ["3", "Không vượt 4-5 giờ/tuần", "Trước 15/09, sản phẩm là portfolio và tài sản tái sử dụng, không cạnh tranh với mục tiêu offer."]
                ]}
              />
            </Card>
          </div>
        </div>
      </section>
  );
}

export function ProductScopeSection() {
  return (
      <section className="section">
        <div className="container">
          <div className="module-grid">
            {[
              ["01 · PUBLIC SITE", "Landing + Catalog", "Trang chủ, banner, câu chuyện thương hiệu, danh sách sản phẩm, chi tiết sản phẩm và CTA Zalo/Facebook."],
              ["02 · ORDER", "Đặt hàng đơn giản", "Form thông tin khách, sản phẩm quan tâm, ghi chú, trạng thái đơn ở mức cơ bản. Ưu tiên COD/manual confirm."],
              ["03 · ADMIN", "Quản trị nội dung", "CRUD sản phẩm, danh mục, ảnh, giá, trạng thái hiển thị, đơn hàng và thông tin liên hệ."],
              ["04 · REUSE", "Theme Config", "Cấu hình màu, logo, font, social link, thông tin shop và banner để clone cho khách mới nhanh hơn."]
            ].map(([code, title, desc]) => (
              <Card key={title} className="module-card">
                <small>{code}</small>
                <h3>{title}</h3>
                <p>{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
  );
}

export function ProductTimelineSection() {
  return (
      <section className="section">
        <div className="container">
          <div className="product-roadmap">
            {productWeeks.map(([week, title, items]) => (
              <Card key={week} className="product-week">
                <small>{week}</small>
                <h3>{title}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>
  );
}

export function ProductKpiSection() {
  return (
    <TargetGrid
      headless
      items={[
        ["1", "Demo public chạy ổn định"],
        ["5-10", "Shop/người quen xem demo"],
        ["3+", "Nhu cầu lặp lại được ghi nhận"],
        ["1", "Bảng báo giá 3 gói"],
        ["≤ 5h", "Thời gian build mỗi tuần trước offer"]
      ]}
    />
  );
}

export function LongTermSections() {
  return (
    <>
      <section className="section" id="long-term">
        <div className="container">
          <div className="two-col">
            <Card className="panel">
              <span className="eyebrow">Cơ cấu mục tiêu</span>
              <div className="income-total">≥ 60M / tháng</div>
              <p className="muted">Lương mới vẫn là nền tảng. Freelance tăng trưởng theo Buy to Build; sản phẩm chỉ mở rộng khi có khách.</p>
              <div className="income-breakdown">
                {[
                  ["Lương chính", "40-45M net", "70%", ""],
                  ["Freelance", "10-15M", "20%", "progress-warn"],
                  ["Sản phẩm", "0-5M ban đầu", "10%", "progress-success"]
                ].map(([title, value, width, strokeClass]) => (
                  <div className="income-row" key={title}>
                    <strong>{title}</strong>
                    <Progress
                      className="income-track"
                      percent={Number.parseInt(width, 10)}
                      showInfo={false}
                      strokeClass={strokeClass}
                    />
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="panel">
              <span className="eyebrow">Kịch bản</span>
              <h3>Ba phương án thu nhập</h3>
              <div className="scenario-list">
                {[
                  ["An toàn", "55-60M", "45 + 10 + 0-5"],
                  ["Cân bằng", "57-60M", "42 + 12 + 3-6"],
                  ["Tăng trưởng", "60M", "40 + 15 + 5"]
                ].map(([title, value, formula]) => (
                  <div className="scenario-card" key={title}>
                    <span className="eyebrow">{title}</span>
                    <strong>{value}</strong>
                    <p>{formula}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
      <TargetGrid
        eyebrow="Điều kiện"
        title="Kiểm soát rủi ro"
        desc="Thu nhập tăng chỉ có ý nghĩa khi không làm giảm hiệu suất công việc chính, sức khỏe và khả năng duy trì lâu dài."
        items={[
          ["≤ 10h/tuần", "Tổng thời gian dành cho freelance và sản phẩm sau khi đổi việc"],
          ["1 dự án/lần", "Không nhận đồng thời nhiều dự án custom"],
          ["≥ 80% reuse", "Mỗi dự án dùng lại phần lớn template và module sẵn có"],
          ["Doanh thu lặp lại", "Ưu tiên setup + maintenance/hosting thay vì chỉ thu một lần"]
        ]}
      />
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

export function EnglishInterviewSections() {
  return (
    <>
      <section className="section" id="english">
        <div className="container two-col">
          <Card className="panel">
            <span className="eyebrow">Tiếng Anh</span>
            <h2>Kế hoạch tiếng Anh</h2>
            <TopicList
              items={[
                ["1", "Self-introduction", "60 giây, 2 phút và 5 phút cho các tình huống khác nhau."],
                ["2", "Project explanation", "Bối cảnh, kiến trúc, thách thức, vai trò và kết quả định lượng."],
                ["3", "Technical reasoning", "Giải thích vì sao chọn Kafka, Redis, microservices, indexing hoặc caching."],
                ["4", "Leadership stories", "Conflict, underperformance, delivery pressure, mentoring và stakeholder."],
                ["5", "Salary & motivation", "Lý do chuyển việc, kỳ vọng vai trò và thương lượng package."]
              ]}
            />
          </Card>
          <Card className="panel">
            <span className="eyebrow">Phỏng vấn</span>
            <h2>Các vòng phỏng vấn</h2>
            <div className="round-grid">
              {[
                ["HR / Recruiter", "Giới thiệu, động lực chuyển việc, English, expected salary và notice period."],
                ["Technical depth", ".NET, Angular, database, performance, distributed systems và debugging."],
                ["System design", "Scale, reliability, consistency, security, observability và trade-off."],
                ["Leadership / Client", "Quản lý team, delivery, BA/PO/QC, khách hàng và giải quyết xung đột."]
              ].map(([title, desc], index) => (
                <div className="round" key={title}>
                  <small>VÒNG {index + 1}</small>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
      <TargetGrid
        eyebrow="Đánh giá"
        title="Scorecard"
        desc="Mỗi Chủ nhật chấm 1-10; mục tiêu trước 15/08 là không còn điểm yếu nghiêm trọng."
        items={[
          ["8/10", "English speaking"],
          ["8/10", ".NET & architecture"],
          ["8/10", "System design"],
          ["8/10", "Leadership stories"],
          ["9/10", "CV & positioning"]
        ]}
      />
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
