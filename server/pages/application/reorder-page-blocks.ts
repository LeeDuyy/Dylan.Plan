import type { PageContentRepository } from "../domain/repository";

export type ReorderPageBlocksInput = { page: string; section: string; orderedIds: string[] };

export function createReorderPageBlocksUseCase(repository: PageContentRepository) {
  return async function reorderPageBlocks(input: ReorderPageBlocksInput): Promise<void> {
    if (input.orderedIds.length === 0) return;
    await repository.reorderBlocks(input.page, input.section, input.orderedIds);
  };
}
