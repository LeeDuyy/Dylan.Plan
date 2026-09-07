import { revalidatePath } from "next/cache";

import type { IncomeSourceRepository } from "../../domain/repositories/income-source-repository";
import { assertMonthNotPast, MonthInPastError } from "../../domain/rules/current-month-rule";

export type ReorderIncomeSourcesInput = {
  monthId: string;
  orderedIds: string[];
};

export class ReorderIncomeSourcesError extends Error {}

export function createReorderIncomeSourcesUseCase(repository: IncomeSourceRepository) {
  return async function reorderIncomeSources(input: ReorderIncomeSourcesInput): Promise<void> {
    const monthId = input.monthId.trim();
    if (!/^\d{4}-\d{2}$/.test(monthId)) {
      throw new ReorderIncomeSourcesError("Mã tháng phải theo định dạng YYYY-MM.");
    }
    if (!Array.isArray(input.orderedIds) || !input.orderedIds.length) {
      throw new ReorderIncomeSourcesError("Danh sách sắp xếp không hợp lệ.");
    }

    const orderedIds = input.orderedIds.map((id) => id.trim());
    if (orderedIds.some((id) => !id)) {
      throw new ReorderIncomeSourcesError("Danh sách sắp xếp không được có id rỗng.");
    }

    try {
      assertMonthNotPast(monthId);
    } catch (error) {
      if (error instanceof MonthInPastError) {
        throw new ReorderIncomeSourcesError(error.message);
      }
      throw error;
    }

    // Danh sách gửi lên phải khớp chính xác tập nguồn thu của tháng này — chặn từ
    // gốc trường hợp client gửi id thiếu/thừa/của tháng khác làm lệch thứ tự
    // (đối xứng với `assertReorderableCategories` của reorder danh mục).
    const existingIds = (await repository.findByMonth(monthId)).map((source) => source.id);
    const orderedSet = new Set(orderedIds);
    const isExactMatch =
      orderedIds.length === existingIds.length &&
      orderedSet.size === existingIds.length &&
      existingIds.every((id) => orderedSet.has(id));
    if (!isExactMatch) {
      throw new ReorderIncomeSourcesError("Danh sách sắp xếp phải khớp chính xác các nguồn thu của tháng này.");
    }

    await repository.reorder(monthId, orderedIds);
    revalidatePath("/budget");
  };
}
