"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  Filter,
  Handshake,
  LineChart,
  Moon,
  PanelsTopLeft,
  PiggyBank,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sun,
  Target,
  Trash2,
  WalletCards
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Tab = "overview" | "roadmap" | "freelance" | "product" | "budget";

type BudgetCategory = {
  id: string;
  name: string;
  type: string;
  budget: number;
  actual: number;
  locked?: boolean;
};

type Transaction = {
  id: string;
  text: string;
  amount: number;
  category: string;
  createdAt: string;
};

type MonthBudget = {
  id: string;
  label: string;
  income: number;
  transactions: Transaction[];
  categories: BudgetCategory[];
};

const STORAGE_KEY = "dylan-plan-next-dashboard-v2";
const DEFAULT_INCOME = 35000000;
const FIXED_COSTS = 22500000;

const defaultCategories: BudgetCategory[] = [
  { id: "rent", name: "Tiền nhà", type: "Cố định", budget: 7500000, actual: 7500000, locked: true },
  { id: "fixed", name: "Chi phí cố định khác", type: "Cố định", budget: 15000000, actual: 15000000, locked: true },
  { id: "food", name: "Ăn uống", type: "Linh hoạt", budget: 4000000, actual: 0 },
  { id: "transport", name: "Di chuyển", type: "Linh hoạt", budget: 1500000, actual: 0 },
  { id: "coffee", name: "Giải trí / cafe", type: "Linh hoạt", budget: 1500000, actual: 0 },
  { id: "health", name: "Sức khỏe / cá nhân", type: "Linh hoạt", budget: 1000000, actual: 0 },
  { id: "saving", name: "Tiết kiệm / đầu tư", type: "Tích lũy", budget: 5000000, actual: 5000000 },
  { id: "backup", name: "Dự phòng", type: "Tích lũy", budget: 500000, actual: 0 }
];

const quickRules = [
  { category: "Tiền nhà", keywords: ["tiền nhà", "thuê nhà", "rent", "phòng trọ", "nhà"] },
  {
    category: "Chi phí cố định khác",
    keywords: ["điện", "nước", "internet", "wifi", "điện thoại", "bảo hiểm", "subscription", "cloud", "server"]
  },
  {
    category: "Ăn uống",
    keywords: ["ăn", "cơm", "bún", "phở", "mì", "trưa", "tối", "sáng", "đồ ăn", "food", "grocery", "siêu thị"]
  },
  { category: "Di chuyển", keywords: ["grab", "taxi", "xăng", "xe", "bus", "vé xe", "parking", "gửi xe", "be", "gojek"] },
  { category: "Giải trí / cafe", keywords: ["cafe", "cà phê", "trà sữa", "xem phim", "game", "coffee", "movie", "nhậu"] },
  { category: "Sức khỏe / cá nhân", keywords: ["thuốc", "khám", "bệnh viện", "skincare", "mỹ phẩm", "cắt tóc", "gym"] },
  { category: "Tiết kiệm / đầu tư", keywords: ["tiết kiệm", "đầu tư", "vàng", "stock", "crypto", "quỹ", "saving"] },
  { category: "Dự phòng", keywords: ["dự phòng", "khẩn cấp", "emergency", "backup"] }
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

function createMonth(id: string, categories = defaultCategories, ratio?: number): MonthBudget {
  return {
    id,
    label: formatMonthLabel(id),
    income: DEFAULT_INCOME,
    transactions: [],
    categories: categories.map((item) => ({
      ...item,
      actual: ratio ? Math.round((item.budget * ratio) / 100000) * 100000 : item.actual
    }))
  };
}

function formatMonthLabel(id: string) {
  const [year, month] = id.split("-");
  return `Tháng ${Number(month)}/${year}`;
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "0đ";
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
}

function shortMoney(value: number) {
  return `${Math.round(value / 100000) / 10}M`;
}

function safeNumber(value: string | number) {
  if (typeof value === "number") return Number.isFinite(value) ? Math.max(0, value) : 0;
  const raw = value.toLowerCase().trim();
  if (!raw) return 0;
  let normalized = raw.replace(/vnđ|vnd|đ|₫|\s/g, "");
  let multiplier = 1;
  if (/tr|m|mil|triệu/.test(normalized)) {
    multiplier = 1000000;
    normalized = normalized.replace(/triệu|tr|mil|m/g, "");
  } else if (/k|nghìn|ngàn/.test(normalized)) {
    multiplier = 1000;
    normalized = normalized.replace(/nghìn|ngàn|k/g, "");
  }
  normalized = normalized.replace(/,/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * multiplier)) : 0;
}

function extractAmount(text: string) {
  const match = text
    .toLowerCase()
    .match(/(\d+(?:[.,]\d+)?\s*(?:tr|triệu|m|mil|k|nghìn|ngàn)?|\d{1,3}(?:[,.]\d{3})+)/i);
  return match ? safeNumber(match[0]) : 0;
}

function normalizeMonth(month: Partial<MonthBudget>, fallbackId = "2026-06"): MonthBudget {
  const id = month.id ?? fallbackId;
  return {
    id,
    label: month.label ?? formatMonthLabel(id),
    income: safeNumber(month.income ?? DEFAULT_INCOME) || DEFAULT_INCOME,
    transactions: Array.isArray(month.transactions) ? month.transactions : [],
    categories: Array.isArray(month.categories)
      ? month.categories.map((item, index) => ({
          id: item.id ?? `cat-${index}`,
          name: item.name ?? "Danh mục",
          type: item.type ?? "Linh hoạt",
          budget: safeNumber(item.budget),
          actual: safeNumber(item.actual),
          locked: item.locked
        }))
      : defaultCategories.map((item) => ({ ...item }))
  };
}

export function DylanPlanApp() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [dark, setDark] = useState(false);
  const [months, setMonths] = useState<MonthBudget[]>([
    createMonth("2026-04", defaultCategories, 0.92),
    createMonth("2026-05", defaultCategories, 1.03),
    createMonth("2026-06")
  ]);
  const [selectedMonthId, setSelectedMonthId] = useState("2026-06");
  const [newMonth, setNewMonth] = useState("2026-07");
  const [quickText, setQuickText] = useState("");
  const [quickCategory, setQuickCategory] = useState(defaultCategories[2].name);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { months?: Partial<MonthBudget>[]; selectedMonthId?: string; dark?: boolean };
        if (parsed.months?.length) {
          const normalized = parsed.months.map((month) => normalizeMonth(month));
          setMonths(normalized);
          setSelectedMonthId(parsed.selectedMonthId ?? normalized.at(-1)?.id ?? normalized[0].id);
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
    const remaining = selectedMonth.income - totalActual;
    const plannedRemaining = selectedMonth.income - totalBudget;
    const ratio = selectedMonth.income ? totalActual / selectedMonth.income : 0;
    const saving = selectedMonth.categories
      .filter((item) => /tiết|đầu tư|dự phòng|tích/i.test(`${item.name} ${item.type}`))
      .reduce((sum, item) => sum + item.actual, 0);
    const flexible = selectedMonth.categories
      .filter((item) => /linh/i.test(item.type))
      .reduce((sum, item) => sum + item.actual, 0);
    const topCategory = [...selectedMonth.categories].sort((a, b) => b.actual - a.actual)[0];
    return { totalBudget, totalActual, remaining, plannedRemaining, ratio, saving, flexible, topCategory };
  }, [selectedMonth]);

  const inferredQuickCategory = useMemo(() => {
    const normalized = quickText.toLowerCase();
    const matched = quickRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
    return matched?.category ?? quickCategory;
  }, [quickCategory, quickText]);

  const quickAmount = useMemo(() => extractAmount(quickText), [quickText]);

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

  const addQuickExpense = () => {
    const text = quickText.trim();
    const amount = extractAmount(text);
    if (!text || !amount) return;
    const categoryName = inferredQuickCategory;
    setMonths((current) =>
      current.map((month) => {
        if (month.id !== selectedMonth.id) return month;
        const categories = month.categories.map((item) =>
          item.name === categoryName ? { ...item, actual: item.actual + amount } : item
        );
        return {
          ...month,
          categories,
          transactions: [
            { id: `tx-${Date.now()}`, text, amount, category: categoryName, createdAt: new Date().toISOString() },
            ...month.transactions
          ]
        };
      })
    );
    setQuickText("");
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
          ? { ...month, transactions: [], categories: month.categories.map((item) => ({ ...item, actual: 0 })) }
          : month
      )
    );
  };

  const createNewMonth = (cloneCurrent: boolean) => {
    if (!newMonth || months.some((month) => month.id === newMonth)) return;
    const categories = selectedMonth.categories.map((item) => ({ ...item, actual: cloneCurrent ? item.actual : 0 }));
    setMonths((current) => [...current, createMonth(newMonth, categories)].sort((a, b) => a.id.localeCompare(b.id)));
    setSelectedMonthId(newMonth);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ months, selectedMonthId }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dylan-plan-budget.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    const initial = [createMonth("2026-04", defaultCategories, 0.92), createMonth("2026-05", defaultCategories, 1.03), createMonth("2026-06")];
    setMonths(initial);
    setSelectedMonthId(initial.at(-1)?.id ?? initial[0].id);
  };

  const summaryCards = [
    ["Mục tiêu offer", "40M net", "Tập trung 15/08-15/09/2026", Target],
    ["Thu nhập hiện tại", shortMoney(DEFAULT_INCOME), "Base để tính ngân sách tháng", WalletCards],
    ["Chi phí cố định", shortMoney(FIXED_COSTS), "Tiền nhà 7.5M + cố định khác 15M", ShieldCheck],
    ["Còn lại tháng này", formatMoney(totals.remaining), totals.ratio >= 0.9 ? "Cảnh báo đã dùng hơn 90%" : "Dòng tiền vẫn trong vùng kiểm soát", PiggyBank]
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
                ["roadmap", "Roadmap", BriefcaseBusiness],
                ["freelance", "Freelance", Handshake],
                ["product", "Sản phẩm", ShoppingBag],
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
              <span className="eyebrow">Career · Buy to Build · Finance</span>
              <h1>
                Kế hoạch <span className="gradient">sự nghiệp, sản phẩm và thu chi</span>
              </h1>
              <p className="lead">
                App hợp nhất hai mẫu mới: roadmap nhận offer 40M net, chiến lược Buy to Build, MVP Mini Shop Builder và
                budget planner thu nhập 35M/tháng có nhập nhanh chi tiêu.
              </p>
              <div className="hero-actions">
                <button className="btn primary" onClick={() => setActiveTab("roadmap")} type="button">
                  <CalendarDays size={18} />
                  Xem roadmap
                </button>
                <button className="btn" onClick={() => setActiveTab("budget")} type="button">
                  <WalletCards size={18} />
                  Nhập thu chi
                </button>
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

        {(activeTab === "overview" || activeTab === "budget") && (
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

        {(activeTab === "overview" || activeTab === "roadmap") && <RoadmapSections />}
        {(activeTab === "overview" || activeTab === "freelance") && <FreelanceSections />}
        {(activeTab === "overview" || activeTab === "product") && <ProductSections />}
        {(activeTab === "overview" || activeTab === "budget") && (
          <BudgetSections
            addCategory={addCategory}
            addQuickExpense={addQuickExpense}
            createNewMonth={createNewMonth}
            exportData={exportData}
            inferredQuickCategory={inferredQuickCategory}
            months={months}
            newMonth={newMonth}
            quickAmount={quickAmount}
            quickCategory={quickCategory}
            quickText={quickText}
            removeCategory={removeCategory}
            resetActual={resetActual}
            resetAll={resetAll}
            selectedMonth={selectedMonth}
            selectedMonthId={selectedMonthId}
            setNewMonth={setNewMonth}
            setQuickCategory={setQuickCategory}
            setQuickText={setQuickText}
            setSelectedMonthId={setSelectedMonthId}
            totals={totals}
            updateCategory={updateCategory}
          />
        )}
      </main>

      <footer className="footer">
        <div className="container">Bắt đầu 22/06/2026 · Offer 40M net · Buy to Build · Mini Shop Builder · Budget 35M/tháng</div>
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
      <LongTermSections />
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

type BudgetProps = {
  addCategory: () => void;
  addQuickExpense: () => void;
  createNewMonth: (cloneCurrent: boolean) => void;
  exportData: () => void;
  inferredQuickCategory: string;
  months: MonthBudget[];
  newMonth: string;
  quickAmount: number;
  quickCategory: string;
  quickText: string;
  removeCategory: (id: string) => void;
  resetActual: () => void;
  resetAll: () => void;
  selectedMonth: MonthBudget;
  selectedMonthId: string;
  setNewMonth: (value: string) => void;
  setQuickCategory: (value: string) => void;
  setQuickText: (value: string) => void;
  setSelectedMonthId: (value: string) => void;
  totals: {
    totalBudget: number;
    totalActual: number;
    remaining: number;
    plannedRemaining: number;
    ratio: number;
    saving: number;
    flexible: number;
    topCategory: BudgetCategory;
  };
  updateCategory: (id: string, patch: Partial<BudgetCategory>) => void;
};

function BudgetSections({
  addCategory,
  addQuickExpense,
  createNewMonth,
  exportData,
  inferredQuickCategory,
  months,
  newMonth,
  quickAmount,
  quickCategory,
  quickText,
  removeCategory,
  resetActual,
  resetAll,
  selectedMonth,
  selectedMonthId,
  setNewMonth,
  setQuickCategory,
  setQuickText,
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
            <p>Mỗi tháng có dữ liệu riêng. Tạo tháng mới sẽ sao chép kế hoạch ngân sách và reset chi thực tế về 0.</p>
          </div>
          <div className="two-col">
            <article className="card panel">
              <span className="eyebrow">Tháng đang xem</span>
              <h3>{selectedMonth.label}</h3>
              <div className="budget-tools">
                <label>
                  Chọn tháng
                  <select value={selectedMonthId} onChange={(event) => setSelectedMonthId(event.target.value)}>
                    {[...months].reverse().map((month) => (
                      <option key={month.id} value={month.id}>
                        {month.id}
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
                <span className={totals.ratio >= 0.9 ? "danger-progress" : totals.ratio >= 0.8 ? "warning-progress" : ""} style={{ width: `${Math.min(totals.ratio * 100, 100)}%` }} />
              </div>
              <div className={`result ${totals.remaining >= 0 ? "positive" : "negative"}`}>
                {totals.remaining >= 0 ? `Còn lại ${formatMoney(totals.remaining)}` : `Vượt thu nhập ${formatMoney(Math.abs(totals.remaining))}`}
                <small>{totals.ratio >= 0.9 ? "Cảnh báo: đã dùng hơn 90% thu nhập." : "Tình trạng vẫn trong vùng kiểm soát."}</small>
              </div>
            </article>
          </div>

          <div className="month-grid" style={{ marginTop: 16 }}>
            {[...months].reverse().map((month) => {
              const actual = month.categories.reduce((sum, item) => sum + item.actual, 0);
              const percent = month.income ? (actual / month.income) * 100 : 0;
              return (
                <article
                  className={`card month-card ${month.id === selectedMonthId ? "active" : ""}`}
                  key={month.id}
                  onClick={() => setSelectedMonthId(month.id)}
                >
                  <span className="eyebrow">{month.id}</span>
                  <h3>{formatMoney(month.income - actual)} còn lại</h3>
                  <p>
                    Chi {formatMoney(actual)} · {percent.toFixed(1)}% thu nhập
                  </p>
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
              <h2>Bảng ngân sách và nhập nhanh</h2>
            </div>
            <p>Gõ tự nhiên như "cafe 45k", "grab 80k", "ăn trưa 65000"; app tự nhận diện số tiền và danh mục.</p>
          </div>
          <article className="card panel">
            <div className="quick-panel">
              <span className="eyebrow">Quick input</span>
              <h3>Nhập nhanh chi tiêu</h3>
              <div className="quick-grid">
                <label>
                  Nội dung chi tiêu
                  <input
                    type="text"
                    placeholder="VD: ăn trưa 65k, grab 80k, tiền điện 500k"
                    value={quickText}
                    onChange={(event) => {
                      setQuickText(event.target.value);
                      const normalized = event.target.value.toLowerCase();
                      const matched = quickRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
                      if (matched) setQuickCategory(matched.category);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addQuickExpense();
                    }}
                  />
                </label>
                <label>
                  Danh mục nhận diện
                  <select value={quickCategory} onChange={(event) => setQuickCategory(event.target.value)}>
                    {selectedMonth.categories.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn primary" disabled={!quickText.trim() || !quickAmount} onClick={addQuickExpense} type="button">
                  <Plus size={18} />
                  Ghi nhận
                </button>
              </div>
              <div className="quick-result">
                {quickText.trim()
                  ? quickAmount
                    ? (
                        <>
                          Tự nhận diện: <strong>{formatMoney(quickAmount)}</strong> → <strong>{inferredQuickCategory}</strong>.
                        </>
                      )
                    : "Chưa tìm thấy số tiền. Hãy nhập ví dụ: cafe 45k hoặc grab 80,000."
                  : "Nhập nội dung để hệ thống gợi ý danh mục và số tiền."}
              </div>
              <div className="transaction-list">
                {selectedMonth.transactions.slice(0, 8).length ? (
                  selectedMonth.transactions.slice(0, 8).map((item) => (
                    <div className="transaction" key={item.id}>
                      <div>
                        <strong>{item.text}</strong>
                        <small>
                          <b>{item.category}</b> · {new Date(item.createdAt).toLocaleString("vi-VN")}
                        </small>
                      </div>
                      <span className="money negative">-{formatMoney(item.amount)}</span>
                    </div>
                  ))
                ) : (
                  <div className="muted small">Chưa có giao dịch nhập nhanh trong tháng này.</div>
                )}
              </div>
            </div>

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
                    const ratio = selectedMonth.income ? item.actual / selectedMonth.income : 0;
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
                            inputMode="numeric"
                            value={item.budget.toLocaleString("en-US")}
                            onChange={(event) => updateCategory(item.id, { budget: safeNumber(event.target.value) })}
                          />
                        </td>
                        <td>
                          <input
                            inputMode="numeric"
                            value={item.actual.toLocaleString("en-US")}
                            onChange={(event) => updateCategory(item.id, { actual: safeNumber(event.target.value) })}
                          />
                        </td>
                        <td className={`money ${diff >= 0 ? "positive" : "negative"}`}>{formatMoney(diff)}</td>
                        <td>{(ratio * 100).toFixed(1)}%</td>
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
                    <td>{(totals.ratio * 100).toFixed(1)}%</td>
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
              ["Chi nhiều nhất", totals.topCategory?.name ?? "-", formatMoney(totals.topCategory?.actual ?? 0), LineChart],
              ["Tiết kiệm / tích lũy", formatMoney(totals.saving), `${((totals.saving / selectedMonth.income) * 100).toFixed(1)}% thu nhập`, PiggyBank],
              ["Chi linh hoạt", formatMoney(totals.flexible), "Mục tiêu nên giữ quanh 7.5M", Filter]
            ].map(([title, value, desc, Icon]) => (
              <article className="card insight" key={title as string}>
                <Icon size={21} />
                <span className="eyebrow">{title as string}</span>
                <strong>{value as string}</strong>
                <span>{desc as string}</span>
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
                    <div className="stick" style={{ height: `${Math.max(4, (item.actual / maxCategory) * 170)}px` }} />
                    <small>{item.name.split(" ")[0]}</small>
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
                      <div className="stick success-stick" style={{ height: `${Math.max(4, (actual / maxMonth) * 170)}px` }} />
                      <small>{month.id.slice(5)}</small>
                    </div>
                  );
                })}
              </div>
              <div className="legend">
                <span style={{ "--legend-color": "var(--success)" } as React.CSSProperties}>Mục tiêu: tổng chi ≤ 30M</span>
                <span style={{ "--legend-color": "var(--warning)" } as React.CSSProperties}>Cảnh báo nếu vượt 90%</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <TargetGrid
        eyebrow="Nguyên tắc"
        title="Quy tắc kiểm soát"
        items={[
          ["01", "Trả tiền cho bản thân trước: tách tối thiểu 5M vào tiết kiệm hoặc đầu tư trước khi chi linh hoạt."],
          ["02", "Giữ quỹ linh hoạt 7.5M sau tiền nhà, chi phí cố định và tiết kiệm."],
          ["03", "Cảnh báo ở mốc 90%: khi tổng chi vượt 31.5M cần dừng chi không cần thiết."],
          ["04", "Review mỗi Chủ nhật: cập nhật chi thực tế và điều chỉnh danh mục trước tuần mới."]
        ]}
      />
    </>
  );
}

function TargetGrid({
  eyebrow,
  title,
  desc,
  items
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  items: string[][];
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          {desc && <p>{desc}</p>}
        </div>
        <div className="targets">
          {items.map(([value, label]) => (
            <article className="card target-card" key={`${value}-${label}`}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
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
