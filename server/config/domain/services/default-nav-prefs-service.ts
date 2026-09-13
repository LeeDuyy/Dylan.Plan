import { ALL_NAV_PREF_IDS, defaultNavPrefSeeds } from "@/lib/nav-registry";

import type { NavPrefRepository } from "../repositories/nav-pref-repository";

export type DefaultNavPrefsServiceDeps = {
  navPrefRepository: NavPrefRepository;
};

export function createDefaultNavPrefsService(deps: DefaultNavPrefsServiceDeps) {
  return {
    async ensureDefaultNavPrefs(): Promise<void> {
      await deps.navPrefRepository.createDefaultsIfEmpty(defaultNavPrefSeeds());
    },
    async resetNavPrefs(): Promise<void> {
      await deps.navPrefRepository.deleteAll();
      await deps.navPrefRepository.createMany(defaultNavPrefSeeds());
    },
    // Đồng bộ NavPref đã seed từ trước với cấu trúc menu tĩnh hiện tại: chèn id
    // mới còn thiếu (không đụng order/hidden id đã có), xoá id không còn tồn tại
    // (vd mục menu bị gộp/đổi href). Idempotent — an toàn gọi mỗi request layout.
    async reconcileNavPrefs(): Promise<void> {
      const seeds = defaultNavPrefSeeds();
      await deps.navPrefRepository.insertMissing(seeds);
      await deps.navPrefRepository.deleteByIdsNotIn(ALL_NAV_PREF_IDS);
    }
  };
}

export type DefaultNavPrefsService = ReturnType<typeof createDefaultNavPrefsService>;
