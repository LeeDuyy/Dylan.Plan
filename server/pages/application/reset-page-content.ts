import { isEditablePageKey } from "@/lib/page-content-defaults";

import type { DefaultPageContentService } from "../domain/service";

export function createResetPageContentUseCase(defaultPageContentService: DefaultPageContentService) {
  return async function resetPageContent(page: string): Promise<void> {
    if (!isEditablePageKey(page)) throw new Error(`Trang "${page}" không thể chỉnh sửa.`);
    await defaultPageContentService.resetPage(page);
  };
}
