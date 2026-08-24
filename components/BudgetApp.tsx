"use client";

import { CalendarDays, CheckCircle2, Copy, Download, Eye, EyeOff, Filter, GripVertical, LineChart, Moon, PiggyBank, Plus, RefreshCcw, Sun, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { TargetGrid } from "@/components/shared/TargetGrid";
import { Toast } from "@/components/shared/Toast";
import { UserMenu } from "@/components/shared/UserMenu";
import { CATEGORY_TYPES, DEFAULT_INCOME, defaultCategories, quickRules } from "@/lib/budget-defaults";
import {
  addPurchaseItem as addPurchaseItemAction,
  clearMonthTransactions,
  createMonth as createMonthAction,
  deletePurchaseItem as deletePurchaseItemAction,
  deleteTransaction,
  getBudgetSnapshot,
  getMigrationStatus,
  markPurchaseItemPurchased as markPurchaseItemPurchasedAction,
  migrateLegacyData,
  recordQuickTransaction,
  removeCategory as removeCategoryAction,
  reorderCategories,
  resetAllBudgetData,
  updatePurchaseItem as updatePurchaseItemAction,
  updateTransaction,
  upsertCategory
} from "@/server/budget/actions";
import type {
  BudgetCategorySnapshot,
  BudgetSnapshot,
  LegacyMigrationPayload,
  MonthBudgetSnapshot,
  PurchaseItemSnapshot,
  TransactionSnapshot,
  UpdateTransactionExpected
} from "@/server/budget/actions";

// Dữ liệu ngân sách giờ đến từ Server Component/Server Action (server/budget/actions.ts),
// nên type của UI dùng lại đúng DTO server trả về (BudgetCategory.actual chỉ đọc,
// Transaction tham chiếu categoryId thay vì tên chuỗi).
type BudgetCategory = BudgetCategorySnapshot;
type Transaction = TransactionSnapshot;
type PurchaseItem = PurchaseItemSnapshot;
type MonthBudget = MonthBudgetSnapshot;
type MonthPeriod = {
  id: string;
  label: string;
  taken: boolean;
};

const STORAGE_KEY = "dylan-plan-next-dashboard-v2";

// --- Hình dạng dữ liệu cũ trong localStorage (trước khi có Prisma), chỉ dùng để
// dựng payload cho luồng di trú một lần (TB-09). Không liên quan tới DTO server.
type LegacyStoredCategory = {
  id?: string;
  name?: string;
  type?: string;
  budget?: number;
  locked?: boolean;
};

type LegacyStoredTransaction = {
  id?: string;
  text?: string;
  amount?: number;
  category?: string;
  createdAt?: string;
};

type LegacyStoredMonth = {
  id?: string;
  label?: string;
  income?: number;
  categories?: LegacyStoredCategory[];
  transactions?: LegacyStoredTransaction[];
};

type LegacyStoredState = {
  months?: LegacyStoredMonth[];
  selectedMonthId?: string;
  dark?: boolean;
};

function toLegacyMigrationPayload(state: LegacyStoredState): LegacyMigrationPayload | null {
  if (!Array.isArray(state.months) || !state.months.length) return null;
  return {
    months: state.months.map((month, monthIndex) => ({
      id: month.id ?? `legacy-month-${monthIndex}`,
      label: month.label,
      income: typeof month.income === "number" ? month.income : DEFAULT_INCOME,
      categories: (month.categories ?? []).map((category, categoryIndex) => ({
        id: category.id ?? `legacy-category-${monthIndex}-${categoryIndex}`,
        name: category.name ?? "Danh mục",
        type: category.type ?? "Linh hoạt",
        budget: typeof category.budget === "number" ? category.budget : 0,
        locked: Boolean(category.locked)
      })),
      transactions: (month.transactions ?? []).map((tx, txIndex) => ({
        id: tx.id ?? `legacy-tx-${monthIndex}-${txIndex}`,
        text: tx.text ?? "",
        amount: typeof tx.amount === "number" ? tx.amount : 0,
        category: tx.category ?? "",
        createdAt: tx.createdAt ?? new Date().toISOString()
      }))
    }))
  };
}

function formatMonthLabel(id: string) {
  const [year, month] = id.split("-");
  return `Tháng ${Number(month)}/${year}`;
}

function formatMonthId(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthPeriods(referenceDate: Date, months: MonthBudget[]): MonthPeriod[] {
  const takenIds = new Set(months.map((month) => month.id));
  const referenceYear = referenceDate.getFullYear();
  const referenceMonth = referenceDate.getMonth();

  return Array.from({ length: 13 }, (_, index) => {
    const date = new Date(referenceYear, referenceMonth + index - 6, 1);
    const id = formatMonthId(date);
    return {
      id,
      label: formatMonthLabel(id),
      taken: takenIds.has(id)
    };
  });
}

function pickDefaultPeriod(periods: MonthPeriod[]) {
  const currentIndex = Math.floor(periods.length / 2);
  const currentPeriod = periods[currentIndex];
  if (currentPeriod && !currentPeriod.taken) return currentPeriod.id;

  for (let distance = 1; distance <= currentIndex; distance += 1) {
    const nextPeriod = periods[currentIndex + distance];
    if (nextPeriod && !nextPeriod.taken) return nextPeriod.id;

    const previousPeriod = periods[currentIndex - distance];
    if (previousPeriod && !previousPeriod.taken) return previousPeriod.id;
  }

  return "";
}

function getQuickViewMonths(months: MonthBudget[], selectedMonthId: string): MonthBudget[] {
  const index = months.findIndex((month) => month.id === selectedMonthId);
  if (index === -1) return [];
  return [months[index - 1], months[index], months[index + 1]].filter(
    (month): month is MonthBudget => Boolean(month)
  );
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return "0đ";
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
}

function safeNumber(value: string | number) {
  if (typeof value === "number") return Number.isFinite(value) ? Math.max(0, value) : 0;
  const raw = value.toLowerCase().trim();
  if (!raw) return 0;
  let normalized = raw.replace(/vnđ|vnd|đ|₫|\s/g, "");

  // Dạng rút gọn kiểu Việt "7tr5"/"10tr25": số nguyên + đơn vị triệu + vài chữ số dính liền
  // không có dấu phân cách, đọc là phần thập phân của triệu (7tr5 = 7,5 triệu = 7.500.000).
  const shorthandMillion = normalized.match(/^(\d+)(?:tr|triệu|mil|m)(\d{1,6})$/);
  if (shorthandMillion) {
    const whole = Number.parseInt(shorthandMillion[1], 10);
    const fracDigits = shorthandMillion[2];
    const fraction = Number.parseInt(fracDigits, 10) * 10 ** (6 - fracDigits.length);
    return Math.max(0, whole * 1000000 + fraction);
  }

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
  // Chuẩn hóa NFC trước khi so khớp: một số bàn phím/IME gõ tiếng Việt sinh ra dạng
  // NFD (dấu tổ hợp rời), khiến "nghìn"/"triệu"/"ngàn" không khớp regex viết dạng NFC
  // dù nhìn giống hệt nhau — bug làm sai đơn vị (vd "500 nghìn" bị đọc thành 500).
  const match = text
    .normalize("NFC")
    .toLowerCase()
    .match(/\d+(?:tr|triệu|mil|m)\d{1,6}|\d+(?:[.,]\d+)?\s*(?:tr|triệu|m|mil|k|nghìn|ngàn)?|\d{1,3}(?:[,.]\d{3})+/i);
  return match ? safeNumber(match[0]) : 0;
}

// So khớp nhãn nhóm chi tiêu (quickRules[].category, cố định trong code) với danh
// mục thật của tháng đang chọn — khớp tuyệt đối trước, không thấy thì so khớp gần
// đúng (chứa chuỗi hai chiều) để vẫn nhận diện đúng khi Dylan đã đổi tên danh mục
// (BR-013). Nhiều kết quả khớp gần đúng thì lấy cái đầu theo thứ tự hiển thị (DEC-060).
function findQuickCategoryMatch(categories: BudgetCategory[], ruleLabel: string): BudgetCategory | undefined {
  const normalize = (value: string) => value.normalize("NFC").toLowerCase().trim();
  const target = normalize(ruleLabel);
  const exact = categories.find((item) => normalize(item.name) === target);
  if (exact) return exact;
  return categories.find((item) => {
    const name = normalize(item.name);
    return name.includes(target) || target.includes(name);
  });
}

const EMPTY_MONTH: MonthBudget = {
  id: "",
  label: "Chưa có dữ liệu",
  income: DEFAULT_INCOME,
  categories: [],
  transactions: [],
  purchaseItems: []
};

type MigrationBannerState = "hidden" | "visible";

type PurchaseItemDraft = PurchaseItem & {
  priceText: string;
};

function formatPurchasePriceInput(price: number | null) {
  return price == null ? "" : price.toLocaleString("en-US");
}

function toPurchaseItemDrafts(items: PurchaseItem[]): PurchaseItemDraft[] {
  return items.map((item) => ({
    ...item,
    priceText: formatPurchasePriceInput(item.price)
  }));
}

function parseOptionalPurchasePrice(value: string) {
  return value.trim() ? safeNumber(value) : null;
}

export function BudgetApp({ initialBudget }: { initialBudget: BudgetSnapshot }) {
  const [dark, setDark] = useState(false);
  const [months, setMonths] = useState<MonthBudget[]>(initialBudget.months);
  const [selectedMonthId, setSelectedMonthId] = useState(initialBudget.months.at(-1)?.id ?? "");
  const [newMonth, setNewMonth] = useState(() => pickDefaultPeriod(buildMonthPeriods(new Date(), initialBudget.months)));
  const [quickText, setQuickText] = useState("");
  const [quickCategory, setQuickCategory] = useState(defaultCategories[2]?.name ?? "");
  const [hydrated, setHydrated] = useState(false);
  const [migrationBanner, setMigrationBanner] = useState<MigrationBannerState>("hidden");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);

  // Payload di trú dữ liệu cũ (nếu còn) được giữ trong ref khi hydrate — TB-09 dùng
  // để gọi migrateLegacyData mà không phải đọc lại localStorage lần hai (tránh đụng
  // độ với effect ghi lại khoá localStorage chỉ còn { dark }, xem effect dưới).
  const legacyPayloadRef = useRef<LegacyMigrationPayload | null>(null);

  // Chỉ còn đọc `dark` từ localStorage — months/selectedMonthId luôn đến từ server
  // (contract mới: khoá `dylan-plan-next-dashboard-v2` chỉ giữ { dark }).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LegacyStoredState;
        legacyPayloadRef.current = toLegacyMigrationPayload(parsed);
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

  const refreshSnapshot = async () => {
    const snapshot = await getBudgetSnapshot();
    setMonths(snapshot.months);
    setSelectedMonthId((current) => (snapshot.months.some((month) => month.id === current) ? current : snapshot.months.at(-1)?.id ?? ""));
  };

  // Luồng di trú một lần từ localStorage sang DB (TB-09): tự động thử lại mỗi lần
  // mở app (DEC-039); nếu InProgress từ thiết bị khác chỉ hiển thị banner chờ,
  // không tự chạy song song (DEC-040).
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    const run = async () => {
      const status = await getMigrationStatus();
      if (cancelled) return;
      if (status.status === "Completed") {
        setMigrationBanner("hidden");
        return;
      }

      const payload = legacyPayloadRef.current;
      if (!payload) {
        // Không còn dữ liệu cũ trong trình duyệt này để di trú.
        setMigrationBanner("hidden");
        return;
      }

      if (status.status === "InProgress") {
        setMigrationBanner("visible");
        return;
      }

      setMigrationBanner("visible");
      const outcome = await migrateLegacyData(payload);
      if (cancelled) return;

      if (outcome.status === "Completed") {
        legacyPayloadRef.current = null;
        setMigrationBanner("hidden");
        await refreshSnapshot();
      } else {
        // Failed hoặc InProgress (thiết bị khác vừa giành claim) — giữ banner, lần
        // mở kế tiếp effect này sẽ tự chạy lại (DEC-039).
        setMigrationBanner("visible");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const selectedMonth = useMemo(
    () => months.find((month) => month.id === selectedMonthId) ?? months[0] ?? EMPTY_MONTH,
    [months, selectedMonthId]
  );

  const monthPeriods = useMemo(() => buildMonthPeriods(new Date(), months), [months]);

  useEffect(() => {
    setNewMonth((current) => (monthPeriods.some((period) => period.id === current && !period.taken) ? current : pickDefaultPeriod(monthPeriods)));
  }, [monthPeriods]);

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
      .filter((item) => item.type === "Khác")
      .reduce((sum, item) => sum + item.actual, 0);
    const topCategory = [...selectedMonth.categories].sort((a, b) => b.actual - a.actual)[0];
    return { totalBudget, totalActual, remaining, plannedRemaining, ratio, saving, flexible, topCategory };
  }, [selectedMonth]);

  // "Chi tiêu khác" chỉ hiển thị khi đang có giao dịch — bản ghi vẫn giữ nguyên
  // trong dữ liệu, chỉ ẩn khỏi giao diện khi actual === 0 (BR-012, DEC-029/030).
  const visibleCategories = useMemo(() => {
    const visible = selectedMonth.categories.filter((item) => !(item.isFallback && item.actual === 0));
    const fallback = visible.find((item) => item.isFallback);
    return fallback ? [...visible.filter((item) => !item.isFallback), fallback] : visible;
  }, [selectedMonth]);

  const inferredQuickCategory = useMemo(() => {
    // Chuẩn hóa NFC — cùng lý do với extractAmount, tránh gõ dấu tiếng Việt dạng NFD
    // làm sai lệch danh mục tự nhận diện (giao dịch bị gán nhầm sang danh mục khác).
    const normalized = quickText.normalize("NFC").toLowerCase();
    const matched = quickRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
    if (matched) {
      // Nhãn rule là chuỗi cố định trong code — có thể không còn khớp tên thật nếu
      // Dylan đã đổi tên danh mục. So khớp gần đúng để không mất giao dịch âm thầm
      // (US-012); rỗng nếu không tìm được kể cả sau khi thử so khớp gần đúng.
      return findQuickCategoryMatch(selectedMonth.categories, matched.category)?.name ?? "";
    }
    return quickCategory;
  }, [quickCategory, quickText, selectedMonth.categories]);

  const quickAmount = useMemo(() => extractAmount(quickText), [quickText]);

  // Cập nhật state cục bộ ngay khi gõ (UX phản hồi tức thì); chỉ thật sự ghi lên
  // server khi rời khỏi ô nhập (commitCategory, onBlur) để tránh gọi Server Action
  // trên từng phím gõ.
  const updateCategoryLocal = (id: string, patch: Partial<Pick<BudgetCategory, "name" | "type" | "budget">>) => {
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

  const commitCategory = async (id: string, overridePatch?: Partial<Pick<BudgetCategory, "name" | "type" | "budget">>) => {
    const category = selectedMonth.categories.find((item) => item.id === id);
    if (!category) return;
    const payload = { ...category, ...overridePatch };
    try {
      await upsertCategory({
        id: payload.id,
        monthId: selectedMonth.id,
        name: payload.name,
        type: payload.type,
        budget: payload.budget
      });
      await refreshSnapshot();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
      await refreshSnapshot();
    }
  };

  const reorderCategoryLocal = (orderedCategoryIds: string[]) => {
    setMonths((current) =>
      current.map((month) => {
        if (month.id !== selectedMonth.id) return month;

        const categoryById = new Map(month.categories.map((category) => [category.id, category]));
        const orderedCategories = orderedCategoryIds
          .map((id) => categoryById.get(id))
          .filter((category): category is BudgetCategory => Boolean(category));
        const fallbackCategories = month.categories.filter((category) => category.isFallback);

        return {
          ...month,
          categories: [...orderedCategories, ...fallbackCategories]
        };
      })
    );
  };

  const resetCategoryDragState = () => {
    setDraggedCategoryId(null);
    setDragOverCategoryId(null);
  };

  const startCategoryDrag = (id: string) => {
    setDraggedCategoryId(id);
  };

  const dragCategoryOver = (id: string) => {
    if (!draggedCategoryId || draggedCategoryId === id) return;
    setDragOverCategoryId(id);
  };

  const dropCategory = async (targetId: string) => {
    if (!draggedCategoryId) return;

    const reorderableCategories = visibleCategories.filter((category) => !category.isFallback);
    const fromIndex = reorderableCategories.findIndex((category) => category.id === draggedCategoryId);
    const toIndex = reorderableCategories.findIndex((category) => category.id === targetId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      resetCategoryDragState();
      await refreshSnapshot();
      return;
    }

    const nextCategories = [...reorderableCategories];
    const [movedCategory] = nextCategories.splice(fromIndex, 1);
    if (!movedCategory) {
      resetCategoryDragState();
      await refreshSnapshot();
      return;
    }
    nextCategories.splice(toIndex, 0, movedCategory);

    const orderedCategoryIds = nextCategories.map((category) => category.id);
    resetCategoryDragState();
    reorderCategoryLocal(orderedCategoryIds);

    try {
      await reorderCategories({ monthId: selectedMonth.id, orderedCategoryIds });
      await refreshSnapshot();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
      await refreshSnapshot();
    }
  };

  const addQuickExpense = async () => {
    const text = quickText.trim();
    const amount = extractAmount(text);
    if (!text || !amount) return;
    const categoryName = inferredQuickCategory;
    // Tên rỗng nghĩa là Dylan bỏ qua chọn danh mục (AC-03) — không tìm theo tên, để
    // server tự lấy/tạo "Chi tiêu khác" (DEC-028/DEC-055). Tên khác rỗng nhưng không
    // khớp danh mục nào còn tồn tại thì bỏ qua thao tác (dữ liệu cục bộ đã cũ).
    const category = categoryName ? selectedMonth.categories.find((item) => item.name === categoryName) : undefined;
    if (categoryName && !category) return;
    await recordQuickTransaction({ monthId: selectedMonth.id, categoryId: category?.id, text, amount });
    await refreshSnapshot();
    setQuickText("");
    setQuickCategory("");
  };

  const addCategory = async () => {
    try {
      await upsertCategory({ monthId: selectedMonth.id, name: "Danh mục mới", type: "Khác", budget: 0 });
      await refreshSnapshot();
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
      await refreshSnapshot();
    }
  };

  const removeCategory = async (id: string) => {
    const result = await removeCategoryAction(id);
    if (result) {
      setToastMessage(
        result.movedCount > 0
          ? `Đã xóa '${result.deletedName}'. ${result.movedCount} giao dịch đã chuyển sang Chi tiêu khác.`
          : `Đã xóa '${result.deletedName}'.`
      );
    }
    await refreshSnapshot();
  };

  const resetActual = async () => {
    await clearMonthTransactions(selectedMonth.id);
    await refreshSnapshot();
  };

  const createNewMonth = async (cloneCurrent: boolean) => {
    if (!newMonth || months.some((month) => month.id === newMonth)) return;
    try {
      await createMonthAction(
        cloneCurrent ? { monthId: newMonth, sourceMonthId: selectedMonth.id || undefined } : { monthId: newMonth }
      );
      const snapshot = await getBudgetSnapshot();
      setMonths(snapshot.months);
      setSelectedMonthId(newMonth);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
      await refreshSnapshot();
    }
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

  const resetAll = async () => {
    await resetAllBudgetData();
    const snapshot = await getBudgetSnapshot();
    setMonths(snapshot.months);
    setSelectedMonthId(snapshot.months.at(-1)?.id ?? "");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav">
          <Link className="brand" href="/">
            <span className="logo">D</span>
            <span>← Dylan Plan Dashboard</span>
          </Link>
          <div className="nav-actions">
            <button className="icon-button" onClick={() => setDark((value) => !value)} title="Đổi giao diện" type="button">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main id="top">
        <BudgetSections
          addCategory={addCategory}
          addQuickExpense={addQuickExpense}
          commitCategory={commitCategory}
          createNewMonth={createNewMonth}
          exportData={exportData}
          inferredQuickCategory={inferredQuickCategory}
          draggedCategoryId={draggedCategoryId}
          dragOverCategoryId={dragOverCategoryId}
          migrationBannerVisible={migrationBanner === "visible"}
          monthPeriods={monthPeriods}
          months={months}
          newMonth={newMonth}
          quickAmount={quickAmount}
          quickCategory={quickCategory}
          quickText={quickText}
          refreshSnapshot={refreshSnapshot}
          removeCategory={removeCategory}
          resetActual={resetActual}
          resetAll={resetAll}
          selectedMonth={selectedMonth}
          selectedMonthId={selectedMonthId}
          setNewMonth={setNewMonth}
          setQuickCategory={setQuickCategory}
          setQuickText={setQuickText}
          setSelectedMonthId={setSelectedMonthId}
          showToast={setToastMessage}
          onCategoryDragEnd={resetCategoryDragState}
          onCategoryDragOver={dragCategoryOver}
          onCategoryDragStart={startCategoryDrag}
          onCategoryDrop={dropCategory}
          toastMessage={toastMessage}
          onDismissToast={() => setToastMessage(null)}
          totals={totals}
          updateCategoryLocal={updateCategoryLocal}
          visibleCategories={visibleCategories}
        />
      </main>
    </div>
  );
}

type BudgetProps = {
  addCategory: () => void;
  addQuickExpense: () => void;
  commitCategory: (id: string, overridePatch?: Partial<Pick<BudgetCategory, "name" | "type" | "budget">>) => void;
  createNewMonth: (cloneCurrent: boolean) => void;
  draggedCategoryId: string | null;
  dragOverCategoryId: string | null;
  exportData: () => void;
  inferredQuickCategory: string;
  migrationBannerVisible: boolean;
  monthPeriods: MonthPeriod[];
  months: MonthBudget[];
  newMonth: string;
  quickAmount: number;
  quickCategory: string;
  quickText: string;
  refreshSnapshot: () => Promise<void>;
  removeCategory: (id: string) => void;
  resetActual: () => void;
  resetAll: () => void;
  selectedMonth: MonthBudget;
  selectedMonthId: string;
  setNewMonth: (value: string) => void;
  setQuickCategory: (value: string) => void;
  setQuickText: (value: string) => void;
  setSelectedMonthId: (value: string) => void;
  showToast: (message: string) => void;
  onCategoryDragEnd: () => void;
  onCategoryDragOver: (id: string) => void;
  onCategoryDragStart: (id: string) => void;
  onCategoryDrop: (id: string) => Promise<void>;
  toastMessage: string | null;
  onDismissToast: () => void;
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
  updateCategoryLocal: (id: string, patch: Partial<Pick<BudgetCategory, "name" | "type" | "budget">>) => void;
  visibleCategories: BudgetCategory[];
};

function BudgetSections({
  addCategory,
  addQuickExpense,
  commitCategory,
  createNewMonth,
  draggedCategoryId,
  dragOverCategoryId,
  exportData,
  inferredQuickCategory,
  migrationBannerVisible,
  monthPeriods,
  months,
  newMonth,
  quickAmount,
  quickCategory,
  quickText,
  refreshSnapshot,
  removeCategory,
  resetActual,
  resetAll,
  selectedMonth,
  selectedMonthId,
  setNewMonth,
  setQuickCategory,
  setQuickText,
  setSelectedMonthId,
  showToast,
  onCategoryDragEnd,
  onCategoryDragOver,
  onCategoryDragStart,
  onCategoryDrop,
  toastMessage,
  onDismissToast,
  totals,
  updateCategoryLocal,
  visibleCategories
}: BudgetProps) {
  // Sửa/xóa từng giao dịch inline (US-004, DEC-046): tại một thời điểm chỉ một dòng
  // ở chế độ khác "hiển thị thường" — dùng id dòng đang active + chế độ hiện tại.
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);
  const [activeTransactionMode, setActiveTransactionMode] = useState<"edit" | "confirm-delete" | null>(null);
  const [showSaving, setShowSaving] = useState(false);
  const [editForm, setEditForm] = useState<{ text: string; amount: string; categoryId: string; createdAt: string } | null>(
    null
  );
  const [editExpected, setEditExpected] = useState<UpdateTransactionExpected | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [newPurchaseName, setNewPurchaseName] = useState("");
  const [newPurchasePrice, setNewPurchasePrice] = useState("");
  const [purchaseItemsDraft, setPurchaseItemsDraft] = useState<PurchaseItemDraft[]>(() =>
    toPurchaseItemDrafts(selectedMonth.purchaseItems)
  );

  const currentMonthId = formatMonthId(new Date());
  const canEditPurchaseItems = selectedMonth.id === currentMonthId;

  useEffect(() => {
    setPurchaseItemsDraft(toPurchaseItemDrafts(selectedMonth.purchaseItems));
    setNewPurchaseName("");
    setNewPurchasePrice("");
  }, [selectedMonth.id, selectedMonth.purchaseItems]);

  const resetTransactionRowState = () => {
    setActiveTransactionId(null);
    setActiveTransactionMode(null);
    setEditForm(null);
    setEditExpected(null);
    setEditError(null);
  };

  const startEditTransaction = (item: TransactionSnapshot) => {
    setActiveTransactionId(item.id);
    setActiveTransactionMode("edit");
    setEditForm({
      text: item.text,
      amount: String(item.amount),
      categoryId: item.categoryId,
      createdAt: item.createdAt.slice(0, 10)
    });
    setEditExpected({
      text: item.text,
      amount: item.amount,
      categoryId: item.categoryId,
      createdAt: item.createdAt
    });
    setEditError(null);
  };

  const saveEditTransaction = async (item: TransactionSnapshot) => {
    if (!editForm || !editExpected) return;
    const text = editForm.text.trim();
    const amount = Number(editForm.amount);
    if (!text || !(amount > 0)) return;
    try {
      await updateTransaction({
        id: item.id,
        monthId: selectedMonth.id,
        categoryId: editForm.categoryId,
        text,
        amount,
        createdAt: new Date(editForm.createdAt).toISOString(),
        expected: editExpected
      });
      await refreshSnapshot();
      resetTransactionRowState();
    } catch (error) {
      // Bắt lỗi thật (ngày tương lai — AC-04; xung đột đồng thời — AC-11) để hiển thị
      // tại chỗ, giữ nguyên chế độ sửa và input Dylan đang gõ.
      setEditError(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const startDeleteTransaction = (id: string) => {
    setActiveTransactionId(id);
    setActiveTransactionMode("confirm-delete");
  };

  const confirmDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
    await refreshSnapshot();
    resetTransactionRowState();
  };

  const updatePurchaseItemLocal = (id: string, patch: Partial<Pick<PurchaseItemDraft, "name" | "priceText">>) => {
    setPurchaseItemsDraft((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const restorePurchaseItemLocal = (id: string) => {
    const original = selectedMonth.purchaseItems.find((item) => item.id === id);
    if (!original) {
      setPurchaseItemsDraft((current) => current.filter((item) => item.id !== id));
      return;
    }
    setPurchaseItemsDraft((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...original,
              priceText: formatPurchasePriceInput(original.price)
            }
          : item
      )
    );
  };

  const addPurchaseItem = async () => {
    const name = newPurchaseName.trim();
    if (!name || !canEditPurchaseItems) return;
    try {
      await addPurchaseItemAction({
        monthId: selectedMonth.id,
        name,
        price: parseOptionalPurchasePrice(newPurchasePrice)
      });
      setNewPurchaseName("");
      setNewPurchasePrice("");
      await refreshSnapshot();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
      await refreshSnapshot();
    }
  };

  const commitPurchaseItemName = async (id: string) => {
    if (!canEditPurchaseItems) return;
    const draft = purchaseItemsDraft.find((item) => item.id === id);
    const original = selectedMonth.purchaseItems.find((item) => item.id === id);
    if (!draft || !original) return;

    const name = draft.name.trim();
    if (!name) {
      restorePurchaseItemLocal(id);
      return;
    }
    if (name === original.name) return;

    try {
      await updatePurchaseItemAction({ id, name });
      await refreshSnapshot();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
      await refreshSnapshot();
    }
  };

  const commitPurchaseItemPrice = async (id: string) => {
    if (!canEditPurchaseItems) return;
    const draft = purchaseItemsDraft.find((item) => item.id === id);
    const original = selectedMonth.purchaseItems.find((item) => item.id === id);
    if (!draft || !original) return;

    const price = parseOptionalPurchasePrice(draft.priceText);
    if (price === original.price) {
      updatePurchaseItemLocal(id, { priceText: formatPurchasePriceInput(original.price) });
      return;
    }

    try {
      await updatePurchaseItemAction({ id, price });
      await refreshSnapshot();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
      await refreshSnapshot();
    }
  };

  const markPurchaseItemPurchased = async (id: string) => {
    if (!canEditPurchaseItems) return;
    setPurchaseItemsDraft((current) =>
      current.map((item) => (item.id === id ? { ...item, status: "Purchased" } : item))
    );
    try {
      await markPurchaseItemPurchasedAction(id);
      await refreshSnapshot();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
      await refreshSnapshot();
    }
  };

  const deletePurchaseItem = async (id: string) => {
    if (!canEditPurchaseItems) return;
    setPurchaseItemsDraft((current) => current.filter((item) => item.id !== id));
    try {
      await deletePurchaseItemAction(id);
      await refreshSnapshot();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.");
      await refreshSnapshot();
    }
  };

  const maxMonth = Math.max(...months.map((month) => month.categories.reduce((sum, item) => sum + item.actual, 0)), 1);

  const pieCategories = visibleCategories.filter((item) => item.actual > 0);
  const pieTotal = pieCategories.reduce((sum, item) => sum + item.actual, 0);
  let pieCursor = 0;
  const pieSlices = pieCategories.map((item, index) => {
    const pct = pieTotal > 0 ? (item.actual / pieTotal) * 100 : 0;
    const start = pieCursor;
    pieCursor += pct;
    return { ...item, pct, start, end: pieCursor, color: `var(--chart-${(index % 8) + 1})` };
  });
  const pieGradient = pieSlices.length
    ? `conic-gradient(${pieSlices.map((slice) => `${slice.color} ${slice.start}% ${slice.end}%`).join(", ")})`
    : undefined;

  return (
    <>
      <Toast message={toastMessage} onDismiss={onDismissToast} />
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

      <section className="section" id="monthly">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Theo tháng</span>
              <h2>Lịch sử thu chi</h2>
            </div>
            <p>Mỗi tháng có dữ liệu riêng. Tạo tháng mới sẽ sao chép kế hoạch ngân sách và reset chi thực tế về 0.</p>
          </div>
          {migrationBannerVisible && (
            <article
              className="card panel"
              role="status"
              style={{ borderLeft: "4px solid var(--warning)", marginBottom: 16 }}
            >
              <span className="eyebrow">Di trú dữ liệu</span>
              <strong>Việc chuyển dữ liệu cũ sang lưu trữ mới chưa hoàn tất, dữ liệu cũ của bạn vẫn còn nguyên.</strong>
            </article>
          )}
          <div className="two-col">
            <div className="month-panels">
              <article className="card panel spotlight">
                <label>
                  <span className="spotlight-label">
                    <CalendarDays size={16} />
                    Chọn tháng xem
                  </span>
                  <select value={selectedMonthId} onChange={(event) => setSelectedMonthId(event.target.value)}>
                    {[...months].reverse().map((month) => (
                      <option key={month.id} value={month.id}>
                        {month.id}
                      </option>
                    ))}
                  </select>
                </label>
              </article>

              <article className="card panel">
                <label>
                  Tạo tháng mới
                  <select value={newMonth} onChange={(event) => setNewMonth(event.target.value)}>
                    {!newMonth && (
                      <option disabled hidden value="">
                        Không còn kỳ tháng trống
                      </option>
                    )}
                    {monthPeriods.map((period) => (
                      <option disabled={period.taken} key={period.id} value={period.id}>
                        {period.taken ? `${period.label} (Đã có dữ liệu)` : period.label}
                      </option>
                    ))}
                  </select>
                </label>
                {!newMonth && <p className="muted small">Không còn kỳ tháng trống trong 6 tháng trước/sau.</p>}
                <div className="actions">
                  <button className="btn primary" disabled={!newMonth} onClick={() => createNewMonth(false)} type="button">
                    <Plus size={18} />
                    Tạo tháng
                  </button>
                  <button className="btn" disabled={!newMonth} onClick={() => createNewMonth(true)} type="button">
                    <Copy size={18} />
                    Clone tháng đang xem
                  </button>
                </div>
              </article>
            </div>

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
            {getQuickViewMonths(months, selectedMonthId).map((month) => {
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
            {(
              [
                ["Chi nhiều nhất", totals.topCategory?.name ?? "-", formatMoney(totals.topCategory?.actual ?? 0), LineChart, false],
                ["Chi khác", formatMoney(totals.flexible), "Mục tiêu nên giữ quanh 7.5M", Filter, false],
                [
                  "Tiết kiệm / tích lũy",
                  formatMoney(totals.saving),
                  `${((totals.saving / selectedMonth.income) * 100).toFixed(1)}% thu nhập`,
                  PiggyBank,
                  true
                ]
              ] as [string, string, string, typeof LineChart, boolean][]
            ).map(([title, value, desc, Icon, maskable]) => (
              <article className="card insight" key={title as string}>
                <div className="insight-head">
                  <Icon size={21} />
                  {maskable ? (
                    <button
                      type="button"
                      className="insight-toggle"
                      onClick={() => setShowSaving((prev) => !prev)}
                      aria-label={showSaving ? "Ẩn giá trị tích lũy" : "Hiện giá trị tích lũy"}
                    >
                      {showSaving ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  ) : null}
                </div>
                <span className="eyebrow">{title as string}</span>
                <strong>{maskable && !showSaving ? "********" : (value as string)}</strong>
                <span>{maskable && !showSaving ? "········" : (desc as string)}</span>
              </article>
            ))}
          </div>

          <div className="two-col" style={{ marginTop: 16 }}>
            <article className="card panel">
              <span className="eyebrow">Cơ cấu chi tiêu</span>
              <h3>Chi thực tế theo danh mục</h3>
              {pieSlices.length ? (
                <div className="pie-wrap">
                  <div className="pie-chart" style={{ background: pieGradient }}>
                    <div className="pie-chart-hole">
                      <strong>{formatMoney(pieTotal)}</strong>
                      <span>Tổng chi</span>
                    </div>
                  </div>
                  <ul className="pie-legend">
                    {pieSlices.map((slice) => (
                      <li key={slice.id}>
                        <span className="pie-dot" style={{ background: slice.color }} />
                        <span className="pie-legend-name">{slice.name}</span>
                        <span className="pie-legend-value">{formatMoney(slice.actual)}</span>
                        <span className="pie-legend-pct">{slice.pct.toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="muted small">Chưa có chi tiêu để hiển thị.</p>
              )}
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
                      const normalized = event.target.value.normalize("NFC").toLowerCase();
                      const matched = quickRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
                      // Không khớp từ khóa nào -> để trống, không giữ lựa chọn cũ (AC-03, DEC-055).
                      // Khớp rồi thì so khớp gần đúng với danh mục thật (US-012) thay vì
                      // dùng thẳng nhãn rule cố định — tránh mất giao dịch âm thầm khi
                      // Dylan đã đổi tên danh mục.
                      setQuickCategory(matched ? (findQuickCategoryMatch(selectedMonth.categories, matched.category)?.name ?? "") : "");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addQuickExpense();
                    }}
                  />
                </label>
                <label>
                  Danh mục nhận diện
                  <select value={quickCategory} onChange={(event) => setQuickCategory(event.target.value)}>
                    <option value="">— Chưa xác định —</option>
                    {visibleCategories.map((item) => (
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
                {selectedMonth.transactions.length ? (
                  selectedMonth.transactions.map((item) => {
                    const categoryName =
                      selectedMonth.categories.find((category) => category.id === item.categoryId)?.name ?? "Không rõ danh mục";
                    const isEditing = activeTransactionId === item.id && activeTransactionMode === "edit";
                    const isConfirmingDelete = activeTransactionId === item.id && activeTransactionMode === "confirm-delete";
                    return (
                      <div key={item.id} style={{ display: "grid", gap: 8 }}>
                        <div className="transaction">
                          <div>
                            <strong>{item.text}</strong>
                            <small>
                              <b>{categoryName}</b> · {new Date(item.createdAt).toLocaleString("vi-VN")}
                            </small>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="money negative">-{formatMoney(item.amount)}</span>
                            <button className="btn ghost" onClick={() => startEditTransaction(item)} type="button">
                              Sửa
                            </button>
                            <button className="btn ghost" onClick={() => startDeleteTransaction(item.id)} type="button">
                              Xóa
                            </button>
                          </div>
                        </div>
                        {isEditing && editForm && (
                          <div className="card panel" style={{ padding: 14 }}>
                            <div className="quick-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                              <label>
                                Nội dung chi tiêu
                                <input
                                  type="text"
                                  value={editForm.text}
                                  onChange={(event) => setEditForm((current) => (current ? { ...current, text: event.target.value } : current))}
                                />
                              </label>
                              <label>
                                Số tiền
                                <input
                                  type="number"
                                  value={editForm.amount}
                                  onChange={(event) => setEditForm((current) => (current ? { ...current, amount: event.target.value } : current))}
                                />
                              </label>
                              <label>
                                Danh mục
                                <select
                                  value={editForm.categoryId}
                                  onChange={(event) => setEditForm((current) => (current ? { ...current, categoryId: event.target.value } : current))}
                                >
                                  {selectedMonth.categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                      {category.name}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                Ngày
                                <input
                                  type="date"
                                  value={editForm.createdAt}
                                  onChange={(event) => setEditForm((current) => (current ? { ...current, createdAt: event.target.value } : current))}
                                />
                              </label>
                            </div>
                            {editError && (
                              <div className="muted small" style={{ color: "var(--danger)", marginTop: 8 }}>
                                {editError}
                              </div>
                            )}
                            <div className="actions" style={{ marginTop: 12 }}>
                              <button
                                className="btn primary"
                                disabled={!editForm.text.trim() || !(Number(editForm.amount) > 0)}
                                onClick={() => saveEditTransaction(item)}
                                type="button"
                              >
                                Lưu
                              </button>
                              <button className="btn ghost" onClick={resetTransactionRowState} type="button">
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}
                        {isConfirmingDelete && (
                          <div className="card panel" style={{ padding: 14 }}>
                            <p>Bạn có chắc muốn xóa giao dịch này?</p>
                            <div className="actions">
                              <button className="btn danger" onClick={() => confirmDeleteTransaction(item.id)} type="button">
                                Xác nhận xóa
                              </button>
                              <button className="btn ghost" onClick={resetTransactionRowState} type="button">
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="muted small">Chưa có giao dịch nhập nhanh trong tháng này.</div>
                )}
              </div>
            </div>

            <div className="quick-panel">
              <span className="eyebrow">{canEditPurchaseItems ? "Danh sách mua sắm" : "Danh sách mua sắm chỉ xem"}</span>
              <h3>Items cần mua</h3>
              {canEditPurchaseItems && (
                <div className="quick-grid">
                  <label>
                    Tên sản phẩm
                    <input
                      type="text"
                      value={newPurchaseName}
                      onChange={(event) => setNewPurchaseName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && newPurchaseName.trim()) addPurchaseItem();
                      }}
                    />
                  </label>
                  <label>
                    Giá
                    <input
                      inputMode="numeric"
                      type="text"
                      value={newPurchasePrice}
                      onChange={(event) => setNewPurchasePrice(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && newPurchaseName.trim()) addPurchaseItem();
                      }}
                    />
                  </label>
                  <button className="btn primary" disabled={!newPurchaseName.trim()} onClick={addPurchaseItem} type="button">
                    <Plus size={18} />
                    Thêm item
                  </button>
                </div>
              )}

              <div className="budget-table-wrap" style={{ marginTop: canEditPurchaseItems ? 14 : 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Giá</th>
                      <th>Trạng thái</th>
                      {canEditPurchaseItems && <th>Hành động</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseItemsDraft.length ? (
                      purchaseItemsDraft.map((item) => {
                        const statusStyle =
                          item.status === "Purchased"
                            ? {
                                background: "var(--success-soft)",
                                borderColor: "color-mix(in srgb, var(--success) 35%, transparent)",
                                color: "var(--success)"
                              }
                            : {
                                background: "var(--warning-soft)",
                                borderColor: "color-mix(in srgb, var(--warning) 35%, transparent)",
                                color: "var(--warning)"
                              };
                        return (
                          <tr key={item.id}>
                            <td>
                              {canEditPurchaseItems ? (
                                <input
                                  value={item.name}
                                  onChange={(event) => updatePurchaseItemLocal(item.id, { name: event.target.value })}
                                  onBlur={() => commitPurchaseItemName(item.id)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") event.currentTarget.blur();
                                  }}
                                />
                              ) : (
                                item.name
                              )}
                            </td>
                            <td>
                              {canEditPurchaseItems ? (
                                <input
                                  inputMode="numeric"
                                  type="text"
                                  value={item.priceText}
                                  onChange={(event) => updatePurchaseItemLocal(item.id, { priceText: event.target.value })}
                                  onBlur={() => commitPurchaseItemPrice(item.id)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") event.currentTarget.blur();
                                  }}
                                />
                              ) : item.price == null ? (
                                ""
                              ) : (
                                <span className="money">{formatMoney(item.price)}</span>
                              )}
                            </td>
                            <td>
                              <span className="pill" style={statusStyle}>
                                {item.status}
                              </span>
                            </td>
                            {canEditPurchaseItems && (
                              <td>
                                <div style={{ display: "flex", gap: 8 }}>
                                  {item.status === "Pending" && (
                                    <button
                                      className="icon-button"
                                      onClick={() => markPurchaseItemPurchased(item.id)}
                                      title="Đánh dấu đã mua"
                                      type="button"
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                  )}
                                  <button
                                    className="icon-button"
                                    onClick={() => deletePurchaseItem(item.id)}
                                    title="Xóa item"
                                    type="button"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="muted small" colSpan={canEditPurchaseItems ? 4 : 3}>
                          Tháng này chưa có item nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="budget-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th aria-label="Sắp xếp"></th>
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
                  {visibleCategories.map((item) => {
                    const diff = item.budget - item.actual;
                    const ratio = selectedMonth.income ? item.actual / selectedMonth.income : 0;
                    // "Chi tiêu khác" là chỉ đọc hoàn toàn — không ô nhập tên/loại/ngân
                    // sách, không nút xóa (BR-010, DEC-027), khác danh mục khóa khác
                    // ("Tiền nhà"...) vốn vẫn cho sửa 3 trường này.
                    if (item.isFallback) {
                      return (
                        <tr key={item.id}>
                          <td></td>
                          <td>{item.name}</td>
                          <td>{item.type}</td>
                          <td className="money">{formatMoney(item.budget)}</td>
                          <td className="money">{formatMoney(item.actual)}</td>
                          <td className={`money ${diff >= 0 ? "positive" : "negative"}`}>{formatMoney(diff)}</td>
                          <td>{(ratio * 100).toFixed(1)}%</td>
                          <td></td>
                        </tr>
                      );
                    }
                    return (
                      <tr
                        key={item.id}
                        onDragOver={(event) => {
                          event.preventDefault();
                          onCategoryDragOver(item.id);
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          onCategoryDrop(item.id);
                        }}
                        style={{
                          background: dragOverCategoryId === item.id ? "var(--primary-soft)" : undefined,
                          opacity: draggedCategoryId === item.id ? 0.55 : 1
                        }}
                      >
                        <td>
                          <button
                            aria-label="Sắp xếp danh mục"
                            className="icon-button"
                            draggable
                            onDragEnd={onCategoryDragEnd}
                            onDragStart={(event) => {
                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData("text/plain", item.id);
                              onCategoryDragStart(item.id);
                            }}
                            style={{ cursor: "grab" }}
                            title="Sắp xếp danh mục"
                            type="button"
                          >
                            <GripVertical size={16} />
                          </button>
                        </td>
                        <td>
                          <input
                            value={item.name}
                            onChange={(event) => updateCategoryLocal(item.id, { name: event.target.value })}
                            onBlur={() => commitCategory(item.id)}
                          />
                        </td>
                        <td>
                          <select
                            value={item.type}
                            onChange={(event) => {
                              const type = event.target.value;
                              updateCategoryLocal(item.id, { type });
                              commitCategory(item.id, { type });
                            }}
                          >
                            {CATEGORY_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            inputMode="numeric"
                            value={item.budget.toLocaleString("en-US")}
                            onChange={(event) => updateCategoryLocal(item.id, { budget: safeNumber(event.target.value) })}
                            onBlur={() => commitCategory(item.id)}
                          />
                        </td>
                        <td className="money">{formatMoney(item.actual)}</td>
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
                    <td colSpan={3}>Tổng cộng</td>
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
    </>
  );
}
