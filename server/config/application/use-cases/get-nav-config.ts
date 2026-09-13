import type { NavPrefEntity } from "../../domain/entities/nav-pref";
import type { NavPrefRepository } from "../../domain/repositories/nav-pref-repository";
import type { DefaultNavPrefsService } from "../../domain/services/default-nav-prefs-service";

export type GetNavConfigDeps = {
  navPrefRepository: NavPrefRepository;
  defaultNavPrefsService: DefaultNavPrefsService;
};

export function createGetNavConfigUseCase(deps: GetNavConfigDeps) {
  return async function getNavConfig(): Promise<NavPrefEntity[]> {
    await deps.defaultNavPrefsService.ensureDefaultNavPrefs();
    return deps.navPrefRepository.findAll();
  };
}
