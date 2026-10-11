// "YYYY-MM-DD" <-> Date theo giờ địa phương (không qua UTC) để ngày không bị lệch một
// ngày khi múi giờ khác 0. Dùng cho `DatePicker` của @vn-dylan/ui (giá trị là Date | null)
// ở những form đang lưu ngày dưới dạng chuỗi "YYYY-MM-DD".
export function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}

export function toDateInput(date: Date | null): string {
  if (!date) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
