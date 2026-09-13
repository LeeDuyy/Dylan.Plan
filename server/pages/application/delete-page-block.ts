import type { PageContentRepository } from "../domain/repository";

export function createDeletePageBlockUseCase(repository: PageContentRepository) {
  return async function deletePageBlock(id: string): Promise<void> {
    await repository.deleteBlock(id);
  };
}
