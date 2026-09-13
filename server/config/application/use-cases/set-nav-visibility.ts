import { revalidatePath } from "next/cache";

import { ALL_NAV_PREF_IDS } from "@/lib/nav-registry";

import type { NavPrefRepository } from "../../domain/repositories/nav-pref-repository";

export type SetNavVisibilityInput = {
  id: string;
  hidden: boolean;
};

export class SetNavVisibilityError extends Error {}

export function createSetNavVisibilityUseCase(repository: NavPrefRepository) {
  return async function setNavVisibility(input: SetNavVisibilityInput): Promise<void> {
    const id = input.id.trim();
    if (!ALL_NAV_PREF_IDS.includes(id)) {
      throw new SetNavVisibilityError("Mục điều hướng không tồn tại.");
    }

    await repository.setHidden(id, Boolean(input.hidden));
    revalidatePath("/", "layout");
  };
}
