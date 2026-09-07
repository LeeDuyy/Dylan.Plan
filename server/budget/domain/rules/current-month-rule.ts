export class MonthInPastError extends Error {}

export function getCurrentMonthId(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function assertMonthNotPast(monthId: string): void {
  const currentMonthId = getCurrentMonthId();
  if (monthId < currentMonthId) {
    throw new MonthInPastError("Chỉ được thao tác từ tháng hiện tại trở đi.");
  }
}
