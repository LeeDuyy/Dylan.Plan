"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Handshake,
  Moon,
  PanelsTopLeft,
  ShieldCheck,
  ShoppingBag,
  Sun,
  Target,
  WalletCards
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { JobTrackerBoard } from "@/components/JobTrackerBoard";
import { TargetGrid } from "@/components/shared/TargetGrid";
import { DEFAULT_INCOME } from "@/lib/budget-defaults";
import type { JobTrackerSnapshot } from "@/server/job-tracker/actions";

type Tab = "overview" | "roadmap" | "freelance" | "product";

const STORAGE_KEY = "dylan-plan-next-dashboard-v2";
const FIXED_COSTS = 22500000;
const EMPTY_JOB_TRACKER: JobTrackerSnapshot = { jobs: [], platforms: [] };

const navItems: [Tab, string, typeof PanelsTopLeft, string][] = [
  ["overview", "Tổng quan", PanelsTopLeft, "/"],
  ["roadmap", "Roadmap", BriefcaseBusiness, "/roadmap"],
  ["freelance", "Freelance", Handshake, "/freelance"],
  ["product", "Sản phẩm", ShoppingBag, "/product"]
];

const roadmapPhases = [
  {
    date: "22/06-30/06",
    label: "Định vị và chuẩn hóa hồ sơ",
    title: "Reset và chuẩn hóa hồ sơ",
    desc: "Chuyển kinh nghiệm thành thông điệp giá trị rõ ràng, không chỉ liệt kê công nghệ.",
    items: [
      ["CV Việt + Anh", "Nhấn mạnh impact, quy mô hệ thống, vai trò quản lý và khách hàng lớn."],
      ["LinkedIn hoàn chỉnh", "Headline, About, project highlights và Open to Work có chọn lọc."],
      ["Career stories", "Chuẩn bị 8 câu chuyện STAR về kỹ thuật, leadership và stakeholder."],
      ["Salary positioning", "Xác định expected salary, mức sàn và cách giải thích giá trị."],
      ["Company list", "Danh sách 30 công ty phù hợp .NET, product, outsourcing quốc tế."],
      ["Skill gap", "Chấm điểm English, coding, system design, leadership và architecture."]
    ]
  },
  {
    date: "01/07-31/07",
    label: "Tăng cường năng lực phỏng vấn",
    title: "Luyện phỏng vấn",
    desc: "Biến kiến thức đã có thành khả năng trình bày ngắn gọn, logic và thuyết phục.",
    items: [
      ["English daily", "45-60 phút/ngày, ưu tiên nói và nghe tình huống phỏng vấn."],
      [".NET review", "ASP.NET Core, EF Core, concurrency, async, performance và security."],
      ["System design", "Ít nhất 8 bài thiết kế: order, loyalty, notification, HRM, high load."],
      ["Leadership interview", "Team performance, conflict, coaching, estimation và delivery risk."],
      ["Mock interview", "2 buổi/tuần: một technical, một HR/English."],
      ["Warm networking", "Kết nối recruiter và referral nhưng chưa ứng tuyển dàn trải."]
    ]
  },
  {
    date: "01/08-14/08",
    label: "Chạy thử quy trình ứng tuyển",
    title: "Ứng tuyển thử",
    desc: "Ứng tuyển chọn lọc để kiểm tra CV, phản hồi thị trường và điều chỉnh trước giai đoạn chính.",
    items: [
      ["5-8 hồ sơ thử", "Chọn công ty phù hợp nhưng chưa phải nhóm ưu tiên cao nhất."],
      ["Recruiter screening", "Kiểm tra phần giới thiệu, expected salary và English communication."],
      ["Feedback loop", "Ghi lại câu hỏi bị yếu và cập nhật câu trả lời ngay trong 24 giờ."],
      ["Portfolio evidence", "Sơ đồ hệ thống, case study, tài liệu quy trình và sản phẩm demo."]
    ]
  },
  {
    date: "15/08-15/09",
    label: "Ứng tuyển tập trung",
    title: "Tối ưu offer 40M net",
    desc: "Tạo pipeline đủ lớn nhưng vẫn ưu tiên chất lượng và khả năng đạt mức 40 triệu net.",
    items: [
      ["20-28 hồ sơ chất lượng", "Ưu tiên product, outsourcing quốc tế, team có stack .NET hoặc cloud."],
      ["Interview pipeline", "Theo dõi vòng HR, technical, system design, leadership và client."],
      ["Offer comparison", "So sánh net salary, bonus, role scope, môi trường, learning và work-life balance."],
      ["Mục tiêu cuối", "Nhận offer phù hợp ở mức 40 triệu net hoặc tổng package tương đương."]
    ]
  }
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

const weekRows = [
  ["06:30-07:15", "Shadowing + self-introduction", "Listening technical English", "Project storytelling", "HR answers", "Vocabulary review", "Ngủ thêm / vận động", "Nghỉ"],
  ["07:15-07:30", "Nói 1 câu hỏi HR", "Nói 1 chủ đề .NET", "Nói 1 STAR story", "Nói 1 design decision", "Weekly recap", "-", "-"],
  ["08:00-18:00", "Công việc chính", "Công việc chính", "Công việc chính", "Công việc chính", "Công việc chính", "Buy to Build: lead / demo / báo giá", "Refactor phần lặp lại"],
  ["19:30-20:15", ".NET / C# core", "System design", "English mock", "Architecture / performance", "Nghỉ hoàn toàn", "Mock technical", "Nghỉ / đi chơi / hồi phục"],
  ["20:15-21:00", "Tóm tắt bằng tiếng Anh", "Record 5 phút design", "Review HR + leadership", "Case study dự án thật", "Nghỉ hoàn toàn", "Review mock + fix gap", "Review KPI & lên kế hoạch"],
  ["21:00-21:30", "Dừng học / thư giãn", "Dừng học / thư giãn", "Dừng học / thư giãn", "Dừng học / thư giãn", "Thư giãn", "Cập nhật case study nhẹ", "Product MVP 60 phút hoặc nghỉ"],
  ["Sau 21:30", "Dừng học", "Dừng học", "Dừng học", "Dừng học", "Nghỉ", "Dừng làm việc", "Nghỉ sớm"]
];

function shortMoney(value: number) {
  return `${Math.round(value / 100000) / 10}M`;
}

export function DylanPlanApp({
  activeTab,
  initialJobTracker = EMPTY_JOB_TRACKER
}: {
  activeTab: Tab;
  initialJobTracker?: JobTrackerSnapshot;
}) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Chỉ đọc/ghi `dark` từ localStorage — độc lập với hiệu ứng tương tự ở /budget
  // (BudgetApp), dùng chung khoá `dylan-plan-next-dashboard-v2` nhưng không chia sẻ
  // React state qua route.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { dark?: boolean };
        setDark(Boolean(parsed.dark));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ dark }));
    }
  }, [dark, hydrated]);

  const summaryCards = [
    ["Mục tiêu offer", "40M net", "Tập trung 15/08-15/09/2026", Target],
    ["Thu nhập hiện tại", shortMoney(DEFAULT_INCOME), "Base để tính ngân sách tháng", WalletCards],
    ["Chi phí cố định", shortMoney(FIXED_COSTS), "Tiền nhà 7.5M + cố định khác 15M", ShieldCheck]
  ] as const;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav">
          <Link className="brand" href="/">
            <span className="logo">D</span>
            <span>Dylan Plan Dashboard</span>
          </Link>
          <div className="nav-actions">
            <nav className="nav-tabs" aria-label="Chuyển khu vực">
              {navItems.map(([tab, label, Icon, href]) => (
                <Link
                  className={`tab-button ${pathname === href ? "active" : ""}`}
                  href={href}
                  key={tab}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              <Link className={`tab-button ${pathname === "/budget" ? "active" : ""}`} href="/budget">
                <WalletCards size={16} />
                Thu chi
              </Link>
            </nav>
            <button className="icon-button" onClick={() => setDark((value) => !value)} title="Đổi giao diện" type="button">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <article className="card hero-main">
              <span className="eyebrow">Career · Buy to Build · Finance</span>
              <h1>
                Kế hoạch <span className="gradient">sự nghiệp, sản phẩm và thu chi</span>
              </h1>
              <p className="lead">
                App hợp nhất hai mẫu mới: roadmap nhận offer 40M net, chiến lược Buy to Build, MVP Mini Shop Builder và
                budget planner thu nhập 35M/tháng có nhập nhanh chi tiêu.
              </p>
              <div className="hero-actions">
                <Link className="btn primary" href="/roadmap">
                  <CalendarDays size={18} />
                  Xem roadmap
                </Link>
                <Link className="btn" href="/budget">
                  <WalletCards size={18} />
                  Nhập thu chi
                </Link>
              </div>
            </article>

            <aside className="card hero-aside">
              <span className="eyebrow">Hồ sơ</span>
              <div className="goal-number">40M NET</div>
              <p className="muted">Senior .NET Engineer / Tech Lead / Engineering Manager phù hợp năng lực.</p>
              <div className="deadline">
                <strong>15/08 - 15/09/2026</strong>
                <span>Khoảng thời gian ứng tuyển và phỏng vấn tập trung</span>
              </div>
              <div className="profile-list">
                {[
                  "Hơn 6 năm kinh nghiệm phát triển phần mềm",
                  "6 tháng đảm nhiệm vai trò Engineering Manager",
                  "Kinh nghiệm .NET, Angular, microservices và hệ thống doanh nghiệp",
                  "Làm việc với khách hàng lớn và nhiều bên liên quan"
                ].map((item) => (
                  <div className="profile-item" key={item}>
                    <CheckCircle2 size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {activeTab === "overview" && (
          <section className="section" id="overview">
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="eyebrow">Tổng quan</span>
                  <h2>Nhìn nhanh mục tiêu và dòng tiền</h2>
                </div>
                <p>Chọn khu vực cần làm việc, hoặc dùng phần tổng quan để kiểm tra nhanh offer target và budget tháng.</p>
              </div>
              <div className="summary-grid">
                {summaryCards.map(([label, value, desc, Icon]) => (
                  <article className="card summary" key={label}>
                    <Icon size={22} />
                    <span className="eyebrow">{label}</span>
                    <div className="value">{value}</div>
                    <p>{desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "overview" && (
          <>
            <PrioritySection />
            <LongTermSections />
          </>
        )}
        {activeTab === "roadmap" && <RoadmapSections initialJobTracker={initialJobTracker} />}
        {activeTab === "freelance" && <FreelanceSections />}
        {activeTab === "product" && <ProductSections />}
      </main>

      <footer className="footer">
        <div className="container">Bắt đầu 22/06/2026 · Offer 40M net · Buy to Build · Mini Shop Builder · Budget 35M/tháng</div>
      </footer>
    </div>
  );
}

function PrioritySection() {
  return (
    <section className="section" id="strategy">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Ưu tiên</span>
            <h2>Ưu tiên hiện tại</h2>
          </div>
          <p>Trong giai đoạn 22/06-15/09, chuyển việc là ưu tiên tuyệt đối; freelance và sản phẩm chỉ hỗ trợ portfolio.</p>
        </div>
        <div className="priority-grid">
          {priorities.map(([title, percent, desc, width], index) => (
            <article className="card priority" key={title}>
              <span className="eyebrow">Ưu tiên {index + 1}</span>
              <div className="percent">{percent}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <div className="bar">
                <i style={{ width: `${width}%` }} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapSections({ initialJobTracker }: { initialJobTracker: JobTrackerSnapshot }) {
  return (
    <>
      <section className="section" id="roadmap">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Roadmap</span>
              <h2>Lộ trình thực hiện</h2>
            </div>
            <p>Mỗi giai đoạn có đầu ra rõ ràng trước khi chuyển sang ứng tuyển số lượng lớn.</p>
          </div>
          <div className="timeline">
            {roadmapPhases.map((phase) => (
              <article className="card phase" key={phase.date}>
                <div className="phase-date">
                  <strong>{phase.date}</strong>
                  <span>{phase.label}</span>
                </div>
                <div>
                  <h3>{phase.title}</h3>
                  <p>{phase.desc}</p>
                  <div className="deliverables">
                    {phase.items.map(([title, desc]) => (
                      <div className="deliverable" key={title}>
                        <strong>{title}</strong>
                        <span className="muted">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <JobTrackerBoard initialJobs={initialJobTracker.jobs} initialPlatforms={initialJobTracker.platforms} />

      <TargetGrid
        eyebrow="Tuần đầu"
        title="Kế hoạch 22/06-28/06"
        desc="Tạo nhịp bền vững, hoàn tất nền tảng hồ sơ và bắt đầu luyện nói đều."
        items={firstWeekTargets}
      />
      <TargetGrid
        eyebrow="KPI"
        title="KPI hằng tuần"
        desc="Các chỉ số trung gian giúp phát hiện sớm CV, tiếng Anh hoặc kỹ thuật đang có vấn đề."
        items={weeklyKpis}
      />
      <TimetableSection />
      <EnglishInterviewSections />
    </>
  );
}

function FreelanceSections() {
  return (
    <>
      <section className="section" id="freelance">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Freelance</span>
              <h2>Buy to Build trước</h2>
            </div>
            <p>Không build platform lớn trước khi có tín hiệu mua; bán gói nhỏ, lấy feedback, rồi chuẩn hóa phần lặp lại.</p>
          </div>
          <div className="freelance-strategy">
            <article className="card panel">
              <span className="eyebrow">Chiến lược chính</span>
              <h3>80% Buy to Build · 20% Build to Buy</h3>
              <p className="muted">Ưu tiên lead, demo, báo giá và delivery nhỏ; chỉ refactor phần đã có tín hiệu lặp lại.</p>
              <div className="hybrid-ratio">
                <span className="buy-build" />
                <span className="build-buy" />
              </div>
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
            </article>
            <article className="card panel">
              <span className="eyebrow">Nguyên tắc</span>
              <h3>Không build khi chưa có tín hiệu mua</h3>
              <TopicList
                items={[
                  ["1", "Bán kết quả, không bán giờ", "Scope, giá, milestone và số lần sửa phải đóng gói từ đầu."],
                  ["2", "Reuse tối thiểu 80%", "Chỉ nhận việc có thể dùng lại template/admin/module hiện có."],
                  ["3", "Platform hóa sau khi lặp lại", "Một feature nên xuất hiện ở ít nhất 2-3 khách hàng trước khi đưa vào core."]
                ]}
              />
            </article>
          </div>
          <div className="service-grid">
            {freelanceServices.map(([code, title, desc, items]) => (
              <article className="card service-card" key={title}>
                <small>{code}</small>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="service-meta">
                  {items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Quy trình</span>
              <h2>Từ lead đến module</h2>
            </div>
            <p>Mỗi lead phải kiểm chứng khách có thật sự cần, có sẵn sàng trả tiền và phần nào có thể reuse.</p>
          </div>
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
      <TargetGrid
        eyebrow="Freelance KPI"
        title="KPI theo tuần"
        desc="Trước offer mới, KPI freelance chỉ đo tín hiệu thị trường."
        items={[
          ["3-5", "Lead phù hợp được tiếp cận"],
          ["1-2", "Cuộc trao đổi nhu cầu"],
          ["1", "Demo hoặc báo giá mẫu gửi đi"],
          ["1", "Pattern/insight được ghi lại"],
          ["≥ 80%", "Tỷ lệ code/template có thể tái sử dụng"],
          ["≤ 4h", "Thời gian freelance mỗi tuần trước offer"]
        ]}
      />
    </>
  );
}

function ProductSections() {
  return (
    <>
      <section className="section" id="personal-product">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Sản phẩm cá nhân</span>
              <h2>Kế hoạch phát triển MVP</h2>
            </div>
            <p>Tạo bộ template bán hàng nhỏ dùng cho shop của bạn, sau đó tái sử dụng cho khách freelance theo Buy to Build.</p>
          </div>
          <div className="two-col">
            <article className="card panel">
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
            </article>
            <article className="card panel">
              <span className="eyebrow">Nguyên tắc build</span>
              <h3>Build nhỏ, dùng được ngay</h3>
              <TopicList
                items={[
                  ["1", "Ưu tiên demo thật", "Website đầu tiên nên phục vụ shop/vòng đá của bạn để có dữ liệu thật và hình ảnh thật."],
                  ["2", "Config trước custom", "Màu, logo, banner, danh mục, sản phẩm, CTA chỉnh bằng config/admin thay vì sửa code."],
                  ["3", "Không vượt 4-5 giờ/tuần", "Trước 15/09, sản phẩm là portfolio và tài sản tái sử dụng, không cạnh tranh với mục tiêu offer."]
                ]}
              />
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">MVP Scope</span>
              <h2>Module cần có</h2>
            </div>
            <p>Chỉ build những phần giúp demo, bán gói nhỏ hoặc reuse cho khách sau.</p>
          </div>
          <div className="module-grid">
            {[
              ["01 · PUBLIC SITE", "Landing + Catalog", "Trang chủ, banner, câu chuyện thương hiệu, danh sách sản phẩm, chi tiết sản phẩm và CTA Zalo/Facebook."],
              ["02 · ORDER", "Đặt hàng đơn giản", "Form thông tin khách, sản phẩm quan tâm, ghi chú, trạng thái đơn ở mức cơ bản. Ưu tiên COD/manual confirm."],
              ["03 · ADMIN", "Quản trị nội dung", "CRUD sản phẩm, danh mục, ảnh, giá, trạng thái hiển thị, đơn hàng và thông tin liên hệ."],
              ["04 · REUSE", "Theme Config", "Cấu hình màu, logo, font, social link, thông tin shop và banner để clone cho khách mới nhanh hơn."]
            ].map(([code, title, desc]) => (
              <article className="card module-card" key={title}>
                <small>{code}</small>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Timeline</span>
              <h2>Lộ trình sản phẩm 8 tuần</h2>
            </div>
            <p>Nếu tuần nào có phỏng vấn, ưu tiên phỏng vấn và đẩy sản phẩm sang cuối tuần.</p>
          </div>
          <div className="product-roadmap">
            {productWeeks.map(([week, title, items]) => (
              <article className="card product-week" key={week}>
                <small>{week}</small>
                <h3>{title}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TargetGrid
        eyebrow="Validation"
        title="KPI sản phẩm"
        desc="KPI đúng là demo có dùng được không, có ai quan tâm không, và có phần nào lặp lại để product hóa không."
        items={[
          ["1", "Demo public chạy ổn định"],
          ["5-10", "Shop/người quen xem demo"],
          ["3+", "Nhu cầu lặp lại được ghi nhận"],
          ["1", "Bảng báo giá 3 gói"],
          ["≤ 5h", "Thời gian build mỗi tuần trước offer"]
        ]}
      />
    </>
  );
}

function LongTermSections() {
  return (
    <>
      <section className="section" id="long-term">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Dài hạn</span>
              <h2>Kế hoạch đến tháng 11</h2>
            </div>
            <p>Hướng tới tổng thu nhập tối thiểu 60M/tháng nhưng không đánh đổi bằng quá tải sau khi vừa chuyển việc.</p>
          </div>
          <div className="two-col">
            <article className="card panel">
              <span className="eyebrow">Cơ cấu mục tiêu</span>
              <div className="income-total">≥ 60M / tháng</div>
              <p className="muted">Lương mới vẫn là nền tảng. Freelance tăng trưởng theo Buy to Build; sản phẩm chỉ mở rộng khi có khách.</p>
              <div className="income-breakdown">
                {[
                  ["Lương chính", "40-45M net", "70%", "salary-bar"],
                  ["Freelance", "10-15M", "20%", "freelance-bar"],
                  ["Sản phẩm", "0-5M ban đầu", "10%", "product-bar"]
                ].map(([title, value, width, cls]) => (
                  <div className="income-row" key={title}>
                    <strong>{title}</strong>
                    <div className="income-track">
                      <i className={cls} style={{ width }} />
                    </div>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </article>
            <article className="card panel">
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
            </article>
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

function TimetableSection() {
  return (
    <section className="section" id="timetable">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Timetable</span>
            <h2>Lịch hằng tuần</h2>
          </div>
          <p>Mỗi tối chỉ có một nhiệm vụ chính, tiếng Anh ngắn hằng ngày và ít nhất một buổi nghỉ hoàn toàn.</p>
        </div>
        <article className="card panel">
          <div className="schedule">
            {["Khung giờ", "T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((item) => (
              <div className="cell head" key={item}>
                {item}
              </div>
            ))}
            {weekRows.flatMap(([time, ...items]) => [
              <div className="cell time" key={time}>
                {time}
              </div>,
              ...items.map((item, index) => (
                <div className={`cell ${scheduleClass(item)}`} key={`${time}-${index}`}>
                  {item}
                </div>
              ))
            ])}
          </div>
          <div className="legend">
            <span style={{ "--legend-color": "var(--blue)" } as React.CSSProperties}>Tiếng Anh</span>
            <span style={{ "--legend-color": "var(--primary)" } as React.CSSProperties}>Phỏng vấn/kỹ thuật</span>
            <span style={{ "--legend-color": "var(--success)" } as React.CSSProperties}>Sản phẩm</span>
            <span style={{ "--legend-color": "var(--warning)" } as React.CSSProperties}>Freelance/portfolio</span>
          </div>
        </article>
      </div>
    </section>
  );
}

function scheduleClass(item: string) {
  if (/english|shadowing|listening|nói|record|tóm tắt|story/i.test(item)) return "english";
  if (/net|design|architecture|mock|review hr|technical/i.test(item)) return "interview";
  if (/product|refactor/i.test(item)) return "product";
  if (/buy to build|lead|demo|case study|báo giá/i.test(item)) return "freelance";
  if (/nghỉ|dừng|thư giãn|-/.test(item)) return "rest";
  return "";
}

function EnglishInterviewSections() {
  return (
    <>
      <section className="section" id="english">
        <div className="container two-col">
          <article className="card panel">
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
          </article>
          <article className="card panel">
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
          </article>
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
          <article className="card panel">
            <span className="eyebrow accept">{acceptTitle}</span>
            <div className="decision-list">
              {acceptItems.map((item) => (
                <div className="decision-item" key={item}>
                  <span className="accept">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="card panel">
            <span className="eyebrow reject">{rejectTitle}</span>
            <div className="decision-list">
              {rejectItems.map((item) => (
                <div className="decision-item" key={item}>
                  <span className="reject">×</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
