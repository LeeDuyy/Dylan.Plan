// Luật P1.1 (docs/memory/rules.md): số tiền giao dịch phải > 0 và ngày giao dịch
// không được ở tương lai (<= hôm nay). Rule thuần, không gọi repository/Prisma.

export class InvalidTransactionInputError extends Error {}

export function assertValidTransactionAmount(amount: number): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new InvalidTransactionInputError("Số tiền giao dịch phải lớn hơn 0.");
  }
}

export function assertTransactionDateNotInFuture(createdAt: Date): void {
  const now = new Date();
  if (createdAt.getTime() > now.getTime()) {
    throw new InvalidTransactionInputError("Ngày giao dịch không được sau ngày hôm nay.");
  }
}
