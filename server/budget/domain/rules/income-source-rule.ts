export class InvalidIncomeSourceInputError extends Error {}

export function assertValidIncomeSourceName(name: string): void {
  if (!name.trim()) {
    throw new InvalidIncomeSourceInputError("Tên nguồn thu không được để trống.");
  }
}

export function assertValidIncomeSourceAmount(amount: number): void {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new InvalidIncomeSourceInputError("Số tiền nguồn thu phải là số nguyên không âm.");
  }
}
