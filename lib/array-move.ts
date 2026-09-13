// Đổi chỗ phần tử index ↔ index+direction, trả mảng mới (hoặc null nếu ra ngoài biên).
export function arrayMove<T>(items: T[], index: number, direction: -1 | 1): T[] | null {
  const target = index + direction;
  if (target < 0 || target >= items.length) return null;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
