import { BudgetApp } from "@/components/BudgetApp";
import { getBudgetSnapshot } from "@/server/budget/actions";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const initialBudget = await getBudgetSnapshot();
  return <BudgetApp initialBudget={initialBudget} />;
}
