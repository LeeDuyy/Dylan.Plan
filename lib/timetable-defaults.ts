// Dữ liệu Timetable mặc định + helper thuần — dùng chung cho server (seed bảng
// TimetableRow khi rỗng) và client (fallback + tô màu ô). Trước US-025 GĐ3 nằm trong
// components/PlanViews.tsx (`weekRows`, `scheduleClass`).

export const TIMETABLE_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type TimetableDayKey = (typeof TIMETABLE_DAY_KEYS)[number];

export const TIMETABLE_DAY_HEADERS: Record<TimetableDayKey, string> = {
  mon: "T2",
  tue: "T3",
  wed: "T4",
  thu: "T5",
  fri: "T6",
  sat: "T7",
  sun: "CN"
};

export type TimetableRowView = {
  id: string;
  timeLabel: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
};

const row = (id: string, timeLabel: string, cells: [string, string, string, string, string, string, string]): TimetableRowView => ({
  id,
  timeLabel,
  mon: cells[0],
  tue: cells[1],
  wed: cells[2],
  thu: cells[3],
  fri: cells[4],
  sat: cells[5],
  sun: cells[6]
});

export const DEFAULT_TIMETABLE_ROWS: TimetableRowView[] = [
  row("seed-row-1", "06:30-07:15", [
    "Shadowing + self-introduction",
    "Listening technical English",
    "Project storytelling",
    "HR answers",
    "Vocabulary review",
    "Ngủ thêm / vận động",
    "Nghỉ"
  ]),
  row("seed-row-2", "07:15-07:30", [
    "Nói 1 câu hỏi HR",
    "Nói 1 chủ đề .NET",
    "Nói 1 STAR story",
    "Nói 1 design decision",
    "Weekly recap",
    "-",
    "-"
  ]),
  row("seed-row-3", "08:00-18:00", [
    "Công việc chính",
    "Công việc chính",
    "Công việc chính",
    "Công việc chính",
    "Công việc chính",
    "Buy to Build: lead / demo / báo giá",
    "Refactor phần lặp lại"
  ]),
  row("seed-row-4", "19:30-20:15", [
    ".NET / C# core",
    "System design",
    "English mock",
    "Architecture / performance",
    "Nghỉ hoàn toàn",
    "Mock technical",
    "Nghỉ / đi chơi / hồi phục"
  ]),
  row("seed-row-5", "20:15-21:00", [
    "Tóm tắt bằng tiếng Anh",
    "Record 5 phút design",
    "Review HR + leadership",
    "Case study dự án thật",
    "Nghỉ hoàn toàn",
    "Review mock + fix gap",
    "Review KPI & lên kế hoạch"
  ]),
  row("seed-row-6", "21:00-21:30", [
    "Dừng học / thư giãn",
    "Dừng học / thư giãn",
    "Dừng học / thư giãn",
    "Dừng học / thư giãn",
    "Thư giãn",
    "Cập nhật case study nhẹ",
    "Product MVP 60 phút hoặc nghỉ"
  ]),
  row("seed-row-7", "Sau 21:30", ["Dừng học", "Dừng học", "Dừng học", "Dừng học", "Nghỉ", "Dừng làm việc", "Nghỉ sớm"])
];

// Tô màu ô lịch theo nội dung (thuần trình bày).
export function scheduleClass(item: string): string {
  if (/english|shadowing|listening|nói|record|tóm tắt|story/i.test(item)) return "english";
  if (/net|design|architecture|mock|review hr|technical/i.test(item)) return "interview";
  if (/product|refactor/i.test(item)) return "product";
  if (/buy to build|lead|demo|case study|báo giá/i.test(item)) return "freelance";
  if (/nghỉ|dừng|thư giãn|-/.test(item)) return "rest";
  return "";
}
