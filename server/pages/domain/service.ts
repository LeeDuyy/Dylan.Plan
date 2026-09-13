import { DEFAULT_PAGE_CONTENT, isEditablePageKey, type PageBlockDefault } from "@/lib/page-content-defaults";

import type { PageBlockSeed } from "./repository";
import type { PageContentRepository } from "./repository";
import type { PageTextEntity } from "./entities";

function toTextSeeds(page: string, texts: Record<string, string>): PageTextEntity[] {
  return Object.entries(texts).map(([key, value]) => ({ page, key, value }));
}

function toBlockSeeds(page: string, blocks: Record<string, PageBlockDefault[]>): PageBlockSeed[] {
  const seeds: PageBlockSeed[] = [];
  for (const [section, items] of Object.entries(blocks)) {
    items.forEach((item, index) => {
      seeds.push({
        page,
        section,
        order: index,
        badge: item.badge ?? null,
        title: item.title ?? null,
        desc: item.desc ?? null,
        value: item.value ?? null,
        weight: item.weight ?? null,
        variant: item.variant ?? null,
        bullets: item.bullets ? JSON.stringify(item.bullets) : null
      });
    });
  }
  return seeds;
}

export type DefaultPageContentServiceDeps = {
  repository: PageContentRepository;
};

export function createDefaultPageContentService({ repository }: DefaultPageContentServiceDeps) {
  function seedsFor(page: string): { texts: PageTextEntity[]; blocks: PageBlockSeed[] } {
    if (!isEditablePageKey(page)) {
      throw new Error(`Trang "${page}" không nằm trong danh sách trang có thể chỉnh sửa.`);
    }
    const defaults = DEFAULT_PAGE_CONTENT[page];
    return { texts: toTextSeeds(page, defaults.texts), blocks: toBlockSeeds(page, defaults.blocks) };
  }

  return {
    async ensureDefaults(page: string): Promise<void> {
      const { texts, blocks } = seedsFor(page);
      await repository.createDefaultsIfEmpty(page, texts, blocks);
    },
    async resetPage(page: string): Promise<void> {
      const { texts, blocks } = seedsFor(page);
      await repository.resetPage(page, texts, blocks);
    }
  };
}

export type DefaultPageContentService = ReturnType<typeof createDefaultPageContentService>;
