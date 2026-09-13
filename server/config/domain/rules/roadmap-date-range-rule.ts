import { parsePhaseRange } from "@/lib/roadmap-defaults";

export class RoadmapDateRangeError extends Error {}

// `dateRange` phải theo format "DD/MM-DD/MM" và parse được thành khoảng ngày hợp lệ.
export function assertValidDateRange(dateRange: string): void {
  const trimmed = dateRange.trim();
  if (!/^\d{1,2}\/\d{1,2}-\d{1,2}\/\d{1,2}$/.test(trimmed)) {
    throw new RoadmapDateRangeError('Khoảng thời gian phải theo dạng "DD/MM-DD/MM", ví dụ 22/06-30/06.');
  }
  const range = parsePhaseRange(trimmed);
  if (!range || Number.isNaN(range.start.getTime()) || Number.isNaN(range.end.getTime())) {
    throw new RoadmapDateRangeError("Khoảng thời gian không hợp lệ (ngày/tháng sai).");
  }
  if (range.end < range.start) {
    throw new RoadmapDateRangeError("Ngày kết thúc phải sau ngày bắt đầu.");
  }
}
