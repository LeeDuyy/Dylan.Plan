export class CurrentMonthViolationError extends Error {}

export function getCurrentMonthId(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function assertMonthIsCurrent(monthId: string): void {
  const currentMonthId = getCurrentMonthId();
  if (monthId !== currentMonthId) {
    throw new CurrentMonthViolationError("Chỉ được thao tác item cần mua trong tháng hiện tại.");
  }
}
