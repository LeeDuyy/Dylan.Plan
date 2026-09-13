import { defaultNavPrefSeeds } from "@/lib/nav-registry";

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
    }
  };
}

export type DefaultNavPrefsService = ReturnType<typeof createDefaultNavPrefsService>;
