// Hằng số mặc định dùng chung cho cả server (seed tháng mới, reset dữ liệu) và
// client (gợi ý danh mục khi nhập nhanh). Chuyển từ `components/DylanPlanApp.tsx`
// sang đây theo TB-02 để 2 tầng dùng chung một nguồn.

export type DefaultCategorySeed = {
  id: string;
  name: string;
  type: string;
  budget: number;
  locked?: boolean;
};

export const CATEGORY_TYPES = ["Cố định", "Tích lũy", "Khác"] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export const DEFAULT_INCOME = 35000000;

export const defaultCategories: DefaultCategorySeed[] = [
  { id: "rent", name: "Tiền nhà", type: "Cố định", budget: 7500000, locked: true },
  { id: "fixed", name: "Chi phí cố định khác", type: "Cố định", budget: 15000000, locked: true },
  { id: "food", name: "Ăn uống", type: "Khác", budget: 4000000 },
  { id: "transport", name: "Di chuyển", type: "Khác", budget: 1500000 },
  { id: "coffee", name: "Giải trí / cafe", type: "Khác", budget: 1500000 },
  { id: "health", name: "Sức khỏe / cá nhân", type: "Khác", budget: 1000000 },
  { id: "saving", name: "Tiết kiệm / đầu tư", type: "Tích lũy", budget: 5000000 },
  { id: "backup", name: "Dự phòng", type: "Tích lũy", budget: 500000 }
];

export const quickRules = [
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
