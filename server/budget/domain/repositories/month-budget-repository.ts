import type { MonthBudgetEntity } from "../entities/month-budget";

export interface MonthBudgetRepository {
  findAll(): Promise<MonthBudgetEntity[]>;
  findById(id: string): Promise<MonthBudgetEntity | null>;
  create(data: MonthBudgetEntity): Promise<MonthBudgetEntity>;
  upsert(data: MonthBudgetEntity): Promise<MonthBudgetEntity>;
  deleteAll(): Promise<void>;
}
