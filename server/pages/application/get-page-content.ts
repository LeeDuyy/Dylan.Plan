import type { PageContentEntity } from "../domain/entities";
import type { PageContentRepository } from "../domain/repository";
import type { DefaultPageContentService } from "../domain/service";

export type GetPageContentDeps = {
  repository: PageContentRepository;
  defaultPageContentService: DefaultPageContentService;
};

export function createGetPageContentUseCase({ repository, defaultPageContentService }: GetPageContentDeps) {
  return async function getPageContent(page: string): Promise<PageContentEntity> {
    await defaultPageContentService.ensureDefaults(page);
    return repository.findByPage(page);
  };
}
