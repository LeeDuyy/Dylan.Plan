import type { IncomeSourceEntity } from "../entities/income-source";

export type CreateIncomeSourceInput = {
  id?: string;
  monthId: string;
  name: string;
  amount: number;
  order?: number;
};

export type UpdateIncomeSourceInput = Partial<Pick<IncomeSourceEntity, "name" | "amount" | "order">>;

export interface IncomeSourceRepository {
  findAll(): Promise<IncomeSourceEntity[]>;
  findByMonth(monthId: string): Promise<IncomeSourceEntity[]>;
  findById(id: string): Promise<IncomeSourceEntity | null>;
  create(data: CreateIncomeSourceInput): Promise<IncomeSourceEntity>;
  update(id: string, patch: UpdateIncomeSourceInput): Promise<IncomeSourceEntity>;
  reorder(monthId: string, orderedIds: string[]): Promise<void>;
  delete(id: string): Promise<void>;
}
