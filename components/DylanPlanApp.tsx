"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  LineChart,
  Moon,
  PanelsTopLeft,
  PiggyBank,
  Plus,
  RefreshCcw,
  Sun,
  Target,
  Trash2,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Tab = "overview" | "roadmap" | "budget";

type BudgetCategory = {
  id: string;
  name: string;
  type: string;
  budget: number;
  actual: number;
  locked?: boolean;
};

type MonthBudget = {
  id: string;
  label: string;
  categories: BudgetCategory[];
};

const STORAGE_KEY = "dylan-plan-next-dashboard-v1";
const DEFAULT_INCOME = 35000000;

const defaultCategories: BudgetCategory[] = [
  { id: "rent", name: "Tiền nhà", type: "Cố định", budget: 7500000, actual: 7500000, locked: true },
  { id: "fixed", name: "Chi phí cố định khác", type: "Cố định", budget: 15000000, actual: 15000000, locked: true },
  { id: "saving", name: "Tiết kiệm / đầu tư", type: "Mục tiêu", budget: 5000000, actual: 5000000 },
  { id: "food", name: "Ăn uống", type: "Linh hoạt", budget: 3200000, actual: 2500000 },
  { id: "transport", name: "Di chuyển", type: "Linh hoạt", budget: 900000, actual: 650000 },
  { id: "learning", name: "Học tập / phỏng vấn", type: "Phát triển", budget: 1000000, actual: 650000 },
  { id: "personal", name: "Cá nhân / giải trí", type: "Linh hoạt", budget: 2400000, actual: 1200000 }
];

const roadmapPhases = [
  {
    date: "22/06-30/06",
    label: "Định vị và chuẩn hóa hồ sơ",
    title: "Reset hồ sơ ứng tuyển",
    desc: "Chuyển kinh nghiệm thành thông điệp giá trị rõ ràng, nhấn vào impact, quản lý và hệ thống doanh nghiệp.",
    items: [
      ["CV Việt + Anh", "Nhấn mạnh .NET, Angular, microservices, leadership và stakeholder."],
      ["LinkedIn hoàn chỉnh", "Headline, About, project highlights và Open to Work có chọn lọc."],
      ["Career stories", "Chuẩn bị 8 câu chuyện STAR cho kỹ thuật, leadership và delivery risk."]
    ]
  },
  {
    date: "01/07-31/07",
    label: "Tăng năng lực phỏng vấn",
    title: "Luyện phỏng vấn có nhịp",
    desc: "Biến kiến thức đang có thành khả năng trình bày ngắn gọn, logic và thuyết phục bằng tiếng Anh.",
    items: [
      ["English daily", "45-60 phút mỗi ngày, ưu tiên giới thiệu bản thân và kể dự án."],
      [".NET review", "ASP.NET Core, EF Core, async, performance, security và clean architecture."],
      ["System design", "Ít nhất 8 bài thiết kế: order, loyalty, notification, HRM, high load."]
    ]
  },
  {
    date: "01/08-14/08",
    label: "Chạy thử thị trường",
    title: "Ứng tuyển thử có chọn lọc",
    desc: "Kiểm tra CV, phản hồi recruiter, mức lương kỳ vọng và các điểm yếu trước giai đoạn chính.",
    items: [
      ["5-8 hồ sơ thử", "Chọn công ty phù hợp nhưng chưa phải nhóm ưu tiên cao nhất."],
      ["Feedback loop", "Ghi lại câu hỏi yếu và cập nhật câu trả lời trong 24 giờ."],
      ["Portfolio evidence", "Case study, sơ đồ hệ thống và demo sản phẩm cá nhân."]
    ]
  },
  {
    date: "15/08-15/09",
    label: "Ứng tuyển tập trung",
    title: "Tối ưu offer 40M net",
    desc: "Đẩy hồ sơ vào nhóm công ty mục tiêu, theo sát pipeline và thương lượng dựa trên giá trị.",
    items: [
      ["30 công ty mục tiêu", "Product, outsourcing quốc tế, team có stack .NET hoặc cloud."],
      ["Mock interview", "2 buổi mỗi tuần: technical, HR, English và leadership."],
      ["Offer strategy", "Giữ mức sàn, expected salary và kịch bản thương lượng rõ ràng."]
    ]
  }
];

const priorities = [
  ["Chuyển việc", "55%", "CV, networking, ứng tuyển, mock interview và xử lý offer.", 100],
  ["Tiếng Anh", "30%", "Giao tiếp nghề nghiệp, kể dự án và trả lời phỏng vấn.", 67],
  ["Sản phẩm", "10%", "Base template và module tái sử dụng cho portfolio.", 34],
  ["Freelance", "5%", "Tìm lead, demo và báo giá mẫu, chưa nhận quá tải.", 23]
];

const focusTopics = [
  [BookOpen, "Tiếng Anh phỏng vấn", "Daily speaking, project story, salary discussion và stakeholder communication."],
  [BriefcaseBusiness, "Career positioning", "Senior .NET Engineer / Tech Lead / Engineering Manager với mức 40M net."],
  [PanelsTopLeft, "Product portfolio", "Template SaaS nhỏ: auth, billing, task, report và case study rõ giá trị."],
  [LineChart, "Buy to Build", "Freelance dùng để mua insight, sau đó biến thành module sản phẩm."],
  [Target, "Interview system", "Scorecard theo technical, system design, leadership, English và culture fit."],
  [WalletCards, "Kỷ luật tài chính", "Giữ tiết kiệm tối thiểu 5M, cảnh báo khi tổng chi vượt 90% thu nhập."]
];

const weekRows = [
  ["Sáng", "English", "System design", "English", ".NET review", "Mock", "Portfolio", "Review"],
  ["Trưa", "Rest", "Recruiter", "Rest", "Networking", "Rest", "Product", "Rest"],
  ["Tối", "Interview", "English", "Product", "Interview", "Freelance", "English", "Planning"]
];

const classBySchedule: Record<string, string> = {
  English: "english",
  Interview: "interview",
  Mock: "interview",
  Product: "product",
  Portfolio: "product",
  Freelance: "freelance",
  Rest: "rest",
  Planning: "rest",
  Review: "rest"
};

function createMonth(id: string, categories = defaultCategories): MonthBudget {
  return {
    id,
    label: formatMonthLabel(id),
    categories: categories.map((item) => ({ ...item }))
  };
}

function formatMonthLabel(id: string) {
  const [year, month] = id.split("-");
  return `Tháng ${Number(month)}/${year}`;
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "0đ";
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}M`;
  }
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
}

function safeNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function DylanPlanApp() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [dark, setDark] = useState(false);
  const [months, setMonths] = useState<MonthBudget[]>([
    createMonth("2026-06"),
    createMonth("2026-07", defaultCategories.map((item) => ({ ...item, actual: item.locked ? item.actual : 0 }))),
    createMonth("2026-08", defaultCategories.map((item) => ({ ...item, actual: item.locked ? item.actual : 0 })))
  ]);
  const [selectedMonthId, setSelectedMonthId] = useState("2026-06");
  const [newMonth, setNewMonth] = useState("2026-09");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { months?: MonthBudget[]; selectedMonthId?: string; dark?: boolean };
        if (parsed.months?.length) {
          setMonths(parsed.months);
          setSelectedMonthId(parsed.selectedMonthId ?? parsed.months[0].id);
        }
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ months, selectedMonthId, dark }));
    }
  }, [dark, hydrated, months, selectedMonthId]);

  const selectedMonth = useMemo(
    () => months.find((month) => month.id === selectedMonthId) ?? months[0],
    [months, selectedMonthId]
  );

  const totals = useMemo(() => {
    const totalBudget = selectedMonth.categories.reduce((sum, item) => sum + item.budget, 0);
    const totalActual = selectedMonth.categories.reduce((sum, item) => sum + item.actual, 0);
    const remaining = DEFAULT_INCOME - totalActual;
    const plannedRemaining = DEFAULT_INCOME - totalBudget;
    const ratio = DEFAULT_INCOME ? totalActual / DEFAULT_INCOME : 0;
    const saving = selectedMonth.categories.find((item) => item.id === "saving")?.actual ?? 0;
    const topCategory = [...selectedMonth.categories].sort((a, b) => b.actual - a.actual)[0];
    return { totalBudget, totalActual, remaining, plannedRemaining, ratio, saving, topCategory };
  }, [selectedMonth]);

  const updateCategory = (id: string, patch: Partial<BudgetCategory>) => {
    setMonths((current) =>
      current.map((month) =>
        month.id === selectedMonth.id
          ? {
              ...month,
              categories: month.categories.map((item) => (item.id === id ? { ...item, ...patch } : item))
            }
          : month
      )
    );
  };

  const addCategory = () => {
    const id = `cat-${Date.now()}`;
    setMonths((current) =>
      current.map((month) =>
        month.id === selectedMonth.id
          ? {
              ...month,
              categories: [...month.categories, { id, name: "Danh mục mới", type: "Linh hoạt", budget: 0, actual: 0 }]
            }
          : month
      )
    );
  };

  const removeCategory = (id: string) => {
    setMonths((current) =>
      current.map((month) =>
        month.id === selectedMonth.id
          ? { ...month, categories: month.categories.filter((item) => item.id !== id || item.locked) }
          : month
      )
    );
  };

  const resetActual = () => {
    setMonths((current) =>
      current.map((month) =>
        month.id === selectedMonth.id
          ? {
              ...month,
              categories: month.categories.map((item) => ({ ...item, actual: item.locked ? item.budget : 0 }))
            }
          : month
      )
    );
  };

  const createNewMonth = (cloneCurrent: boolean) => {
    if (!newMonth || months.some((month) => month.id === newMonth)) return;
    const categories = cloneCurrent
      ? selectedMonth.categories
      : selectedMonth.categories.map((item) => ({ ...item, actual: item.locked ? item.budget : 0 }));
    setMonths((current) => [...current, createMonth(newMonth, categories)].sort((a, b) => a.id.localeCompare(b.id)));
    setSelectedMonthId(newMonth);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ income: DEFAULT_INCOME, months }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dylan-plan-budget.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    const initial = [createMonth("2026-06"), createMonth("2026-07"), createMonth("2026-08")];
    setMonths(initial);
    setSelectedMonthId(initial[0].id);
  };

  const summaryCards = [
    ["Mục tiêu offer", "40M net", "Tập trung 15/08-15/09/2026", Target],
    ["Thu nhập hiện tại", formatMoney(DEFAULT_INCOME), "Base để tính ngân sách tháng", WalletCards],
    ["Còn lại tháng này", formatMoney(totals.remaining), "Sau chi thực tế đã nhập", PiggyBank],
    ["Tỷ lệ sử dụng", `${Math.round(totals.ratio * 100)}%`, "Cảnh báo khi vượt 90%", TrendingUp]
  ] as const;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav">
          <a className="brand" href="#top" onClick={() => setActiveTab("overview")}>
            <span className="logo">D</span>
            <span>Dylan Plan Dashboard</span>
          </a>
          <div className="nav-actions">
            <nav className="nav-tabs" aria-label="Chuyển khu vực">
              {[
                ["overview", "Tổng quan", PanelsTopLeft],
                ["roadmap", "Định hướng", BriefcaseBusiness],
                ["budget", "Thu chi", WalletCards]
              ].map(([tab, label, Icon]) => (
                <button
                  className={`tab-button ${activeTab === tab ? "active" : ""}`}
                  key={tab as string}
                  onClick={() => setActiveTab(tab as Tab)}
                  type="button"
                >
                  <Icon size={16} />
                  {label as string}
                </button>
              ))}
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
              <span className="eyebrow">Career & Finance OS</span>
              <h1>
                Kế hoạch <span className="gradient">định hướng và thu chi</span>
              </h1>
              <p className="lead">
                Dashboard Next.js hợp nhất roadmap chuyển việc, sản phẩm cá nhân, freelance và ngân sách hằng tháng từ
                hai file HTML gốc trong repo. Trọng tâm là giữ rõ mục tiêu 40M net trong khi vẫn kiểm soát dòng tiền.
              </p>
              <div className="hero-actions">
                <button className="btn primary" onClick={() => setActiveTab("roadmap")} type="button">
                  <CalendarDays size={18} />
                  Xem roadmap
                </button>
                <button className="btn" onClick={() => setActiveTab("budget")} type="button">
                  <WalletCards size={18} />
                  Cập nhật thu chi
                </button>
              </div>
            </article>

            <aside className="card hero-aside">
              <span className="eyebrow">Mục tiêu chính</span>
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
                  "Giữ tối thiểu 5M tiết kiệm / đầu tư mỗi tháng"
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

        {(activeTab === "overview" || activeTab === "budget") && (
          <section className="section" id="overview">
            <div className="container">
              <div className="section-head">
                <div>
                  <span className="eyebrow">Tổng quan</span>
                  <h2>Nhìn nhanh mục tiêu và dòng tiền</h2>
                </div>
                <p>Phần này gom các chỉ số quan trọng nhất để biết đang đi đúng hướng nghề nghiệp và tài chính.</p>
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

        {(activeTab === "overview" || activeTab === "roadmap") && <RoadmapSections />}
        {(activeTab === "overview" || activeTab === "budget") && (
          <BudgetSections
            addCategory={addCategory}
            createNewMonth={createNewMonth}
            exportData={exportData}
            months={months}
            newMonth={newMonth}
            removeCategory={removeCategory}
            resetActual={resetActual}
            resetAll={resetAll}
            selectedMonth={selectedMonth}
            selectedMonthId={selectedMonthId}
            setNewMonth={setNewMonth}
            setSelectedMonthId={setSelectedMonthId}
            totals={totals}
            updateCategory={updateCategory}
          />
        )}
      </main>

      <footer className="footer">
        <div className="container">Dylan Plan Dashboard · Next.js · Roadmap nghề nghiệp và ngân sách cá nhân</div>
      </footer>
    </div>
  );
}

function RoadmapSections() {
  return (
    <>
      <section className="section" id="strategy">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Ưu tiên</span>
              <h2>Ưu tiên hiện tại</h2>
            </div>
            <p>Giai đoạn 22/06-15/09 giữ chuyển việc là ưu tiên tuyệt đối; freelance và sản phẩm phục vụ portfolio.</p>
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

      <section className="section" id="roadmap">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Roadmap</span>
              <h2>Lộ trình thực hiện</h2>
            </div>
            <p>Mỗi giai đoạn có đầu ra rõ ràng để tránh học lan man và tránh nhận freelance làm lệch mục tiêu.</p>
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

      <section className="section" id="focus">
        <div className="container two-col">
          <article className="card panel">
            <span className="eyebrow">Năng lực trọng tâm</span>
            <h2>Học đúng phần tạo lợi thế</h2>
            <div className="focus-grid" style={{ marginTop: 18 }}>
              {focusTopics.map(([Icon, title, desc]) => (
                <div className="topic" key={title as string}>
                  <Icon />
                  <div>
                    <strong>{title as string}</strong>
                    <span className="muted">{desc as string}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="card panel">
            <span className="eyebrow">Thu nhập mục tiêu</span>
            <h2>Cấu trúc sau khi ổn định</h2>
            <div className="metric-grid" style={{ marginTop: 18 }}>
              {[
                ["Lương chính", "40M", "Nguồn thu chắc chắn"],
                ["Freelance", "5-15M", "Chỉ nhận dự án gọn"],
                ["Sản phẩm", "0-5M", "Kiểm chứng trước"],
                ["Quỹ an toàn", "3-6 tháng", "Tách khỏi chi tiêu"]
              ].map(([title, value, desc]) => (
                <div className="metric-card card" key={title}>
                  <span className="eyebrow">{title}</span>
                  <strong>{value}</strong>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section" id="timetable">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Timetable</span>
              <h2>Lịch tuần gợi ý</h2>
            </div>
            <p>Lịch giữ nhịp tiếng Anh, phỏng vấn, sản phẩm và nghỉ để không bị quá tải.</p>
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
                  <div className={`cell ${classBySchedule[item] ?? ""}`} key={`${time}-${item}-${index}`}>
                    {item}
                  </div>
                ))
              ])}
            </div>
            <div className="legend">
              <span style={{ "--legend-color": "var(--blue)" } as React.CSSProperties}>Tiếng Anh</span>
              <span style={{ "--legend-color": "var(--primary)" } as React.CSSProperties}>Phỏng vấn</span>
              <span style={{ "--legend-color": "var(--success)" } as React.CSSProperties}>Sản phẩm</span>
              <span style={{ "--legend-color": "var(--warning)" } as React.CSSProperties}>Freelance</span>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

type BudgetProps = {
  addCategory: () => void;
  createNewMonth: (cloneCurrent: boolean) => void;
  exportData: () => void;
  months: MonthBudget[];
  newMonth: string;
  removeCategory: (id: string) => void;
  resetActual: () => void;
  resetAll: () => void;
  selectedMonth: MonthBudget;
  selectedMonthId: string;
  setNewMonth: (value: string) => void;
  setSelectedMonthId: (value: string) => void;
  totals: {
    totalBudget: number;
    totalActual: number;
    remaining: number;
    plannedRemaining: number;
    ratio: number;
    saving: number;
    topCategory: BudgetCategory;
  };
  updateCategory: (id: string, patch: Partial<BudgetCategory>) => void;
};

function BudgetSections({
  addCategory,
  createNewMonth,
  exportData,
  months,
  newMonth,
  removeCategory,
  resetActual,
  resetAll,
  selectedMonth,
  selectedMonthId,
  setNewMonth,
  setSelectedMonthId,
  totals,
  updateCategory
}: BudgetProps) {
  const maxCategory = Math.max(...selectedMonth.categories.map((item) => item.actual), 1);
  const maxMonth = Math.max(...months.map((month) => month.categories.reduce((sum, item) => sum + item.actual, 0)), 1);

  return (
    <>
      <section className="section" id="monthly">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Theo tháng</span>
              <h2>Lịch sử thu chi</h2>
            </div>
            <p>Chọn tháng, nhập chi thực tế và dashboard tự tính còn lại, tỷ lệ dùng ngân sách và trạng thái an toàn.</p>
          </div>
          <div className="two-col">
            <article className="card panel">
              <span className="eyebrow">Tháng đang xem</span>
              <h3>{selectedMonth.label}</h3>
              <div className="budget-tools">
                <label>
                  Chọn tháng
                  <select value={selectedMonthId} onChange={(event) => setSelectedMonthId(event.target.value)}>
                    {months.map((month) => (
                      <option key={month.id} value={month.id}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Tạo tháng mới
                  <input type="month" value={newMonth} onChange={(event) => setNewMonth(event.target.value)} />
                </label>
              </div>
              <div className="actions">
                <button className="btn primary" onClick={() => createNewMonth(false)} type="button">
                  <Plus size={18} />
                  Tạo tháng
                </button>
                <button className="btn" onClick={() => createNewMonth(true)} type="button">
                  <Copy size={18} />
                  Clone tháng hiện tại
                </button>
              </div>
            </article>

            <article className="card panel">
              <span className="eyebrow">Tiến độ</span>
              <h3>Mức sử dụng thu nhập</h3>
              <div className="progress">
                <span style={{ width: `${Math.min(totals.ratio * 100, 100)}%` }} />
              </div>
              <div className="pill-row">
                <span className="pill">Đã chi {formatMoney(totals.totalActual)}</span>
                <span className="pill">Còn {formatMoney(totals.remaining)}</span>
                <span className="pill">Kế hoạch còn {formatMoney(totals.plannedRemaining)}</span>
              </div>
            </article>
          </div>

          <div className="month-grid" style={{ marginTop: 16 }}>
            {months.map((month) => {
              const actual = month.categories.reduce((sum, item) => sum + item.actual, 0);
              return (
                <article
                  className={`card month-card ${month.id === selectedMonthId ? "active" : ""}`}
                  key={month.id}
                  onClick={() => setSelectedMonthId(month.id)}
                >
                  <span className="eyebrow">{month.label}</span>
                  <h3>{formatMoney(DEFAULT_INCOME - actual)} còn lại</h3>
                  <p>Đã chi {formatMoney(actual)} / thu nhập {formatMoney(DEFAULT_INCOME)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="control">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Kiểm soát</span>
              <h2>Bảng ngân sách và chi thực tế</h2>
            </div>
            <p>Chỉnh ngân sách dự kiến, nhập số tiền thực tế đã chi và theo dõi chênh lệch từng danh mục.</p>
          </div>
          <article className="card panel">
            <div className="budget-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Danh mục</th>
                    <th>Loại</th>
                    <th>Ngân sách</th>
                    <th>Chi thực tế</th>
                    <th>Chênh lệch</th>
                    <th>Tỷ trọng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMonth.categories.map((item) => {
                    const diff = item.budget - item.actual;
                    const ratio = totals.totalActual ? item.actual / totals.totalActual : 0;
                    return (
                      <tr key={item.id}>
                        <td>
                          <input value={item.name} onChange={(event) => updateCategory(item.id, { name: event.target.value })} />
                        </td>
                        <td>
                          <input value={item.type} onChange={(event) => updateCategory(item.id, { type: event.target.value })} />
                        </td>
                        <td>
                          <input
                            min={0}
                            type="number"
                            value={item.budget}
                            onChange={(event) => updateCategory(item.id, { budget: safeNumber(event.target.value) })}
                          />
                        </td>
                        <td>
                          <input
                            min={0}
                            type="number"
                            value={item.actual}
                            onChange={(event) => updateCategory(item.id, { actual: safeNumber(event.target.value) })}
                          />
                        </td>
                        <td className={`money ${diff >= 0 ? "positive" : "negative"}`}>{formatMoney(diff)}</td>
                        <td>{Math.round(ratio * 100)}%</td>
                        <td>
                          {!item.locked && (
                            <button className="icon-button" onClick={() => removeCategory(item.id)} title="Xóa danh mục" type="button">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>Tổng cộng</td>
                    <td className="money">{formatMoney(totals.totalBudget)}</td>
                    <td className="money">{formatMoney(totals.totalActual)}</td>
                    <td className={`money ${totals.totalBudget - totals.totalActual >= 0 ? "positive" : "negative"}`}>
                      {formatMoney(totals.totalBudget - totals.totalActual)}
                    </td>
                    <td>{Math.round(totals.ratio * 100)}%</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="actions">
              <button className="btn" onClick={addCategory} type="button">
                <Plus size={18} />
                Thêm danh mục
              </button>
              <button className="btn" onClick={resetActual} type="button">
                <RefreshCcw size={18} />
                Reset chi tháng này
              </button>
              <button className="btn" onClick={exportData} type="button">
                <Download size={18} />
                Xuất JSON
              </button>
              <button className="btn danger" onClick={resetAll} type="button">
                <RefreshCcw size={18} />
                Reset dữ liệu
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="section" id="insight">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Phân tích</span>
              <h2>Insight tài chính</h2>
            </div>
            <p>Nhìn nhanh danh mục chi nhiều nhất, khả năng tiết kiệm và xu hướng qua các tháng.</p>
          </div>
          <div className="insight-grid">
            {[
              ["Danh mục lớn nhất", totals.topCategory?.name ?? "-", formatMoney(totals.topCategory?.actual ?? 0)],
              ["Tiết kiệm thực tế", "Mục tiêu tối thiểu 5M", formatMoney(totals.saving)],
              ["Trạng thái", totals.ratio > 0.9 ? "Cần siết chi" : "Đang an toàn", `${Math.round(totals.ratio * 100)}% thu nhập`]
            ].map(([title, desc, value]) => (
              <article className="card insight" key={title}>
                <span className="eyebrow">{title}</span>
                <strong>{value}</strong>
                <span>{desc}</span>
              </article>
            ))}
          </div>

          <div className="two-col" style={{ marginTop: 16 }}>
            <article className="card panel">
              <span className="eyebrow">Cơ cấu chi tiêu</span>
              <h3>Chi thực tế theo danh mục</h3>
              <div className="chart">
                {selectedMonth.categories.map((item) => (
                  <div className="col" key={item.id}>
                    <div className="stick" style={{ height: `${Math.max(4, (item.actual / maxCategory) * 160)}px` }} />
                    <small>{item.name}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="card panel">
              <span className="eyebrow">Xu hướng</span>
              <h3>Tổng chi qua các tháng</h3>
              <div className="chart">
                {months.map((month) => {
                  const actual = month.categories.reduce((sum, item) => sum + item.actual, 0);
                  return (
                    <div className="col" key={month.id}>
                      <div className="stick" style={{ height: `${Math.max(4, (actual / maxMonth) * 160)}px` }} />
                      <small>{month.label.replace("Tháng ", "T")}</small>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
