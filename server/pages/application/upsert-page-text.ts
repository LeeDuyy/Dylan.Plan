import { isEditablePageKey } from "@/lib/page-content-defaults";

import type { PageContentRepository } from "../domain/repository";

export type UpsertPageTextInput = { page: string; key: string; value: string };

export function createUpsertPageTextUseCase(repository: PageContentRepository) {
  return async function upsertPageText(input: UpsertPageTextInput): Promise<void> {
    if (!isEditablePageKey(input.page)) throw new Error(`Trang "${input.page}" không thể chỉnh sửa.`);
    await repository.upsertText(input.page, input.key, input.value);
  };
}
