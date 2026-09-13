import { revalidatePath } from "next/cache";

import type { DefaultNavPrefsService } from "../../domain/services/default-nav-prefs-service";

export function createResetNavConfigUseCase(defaultNavPrefsService: DefaultNavPrefsService) {
  return async function resetNavConfig(): Promise<void> {
    await defaultNavPrefsService.resetNavPrefs();
    revalidatePath("/", "layout");
  };
}
