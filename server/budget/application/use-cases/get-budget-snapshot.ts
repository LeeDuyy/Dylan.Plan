import type { BudgetSnapshot, BudgetSnapshotService } from "../../domain/services/budget-snapshot-service";

export type { BudgetSnapshot } from "../../domain/services/budget-snapshot-service";

export function createGetBudgetSnapshotUseCase(service: BudgetSnapshotService) {
  return async function getBudgetSnapshot(): Promise<BudgetSnapshot> {
    return service.getSnapshot();
  };
}
