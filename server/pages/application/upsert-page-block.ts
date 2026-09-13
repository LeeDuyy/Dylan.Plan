import { isEditablePageKey } from "@/lib/page-content-defaults";

import type { PageBlockEntity } from "../domain/entities";
import type { PageContentRepository } from "../domain/repository";

export type UpsertPageBlockInput = {
  id?: string;
  page: string;
  section: string;
  badge?: string | null;
  title?: string | null;
  desc?: string | null;
  value?: string | null;
  weight?: number | null;
  variant?: string | null;
  bullets?: string[] | null;
};

export function createUpsertPageBlockUseCase(repository: PageContentRepository) {
  return async function upsertPageBlock(input: UpsertPageBlockInput): Promise<PageBlockEntity> {
    if (!isEditablePageKey(input.page)) throw new Error(`Trang "${input.page}" không thể chỉnh sửa.`);
    const bullets = input.bullets && input.bullets.length > 0 ? JSON.stringify(input.bullets) : null;
    return repository.upsertBlock({ ...input, bullets });
  };
}
