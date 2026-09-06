import type { JobPlatformEntity } from "../entities/job-platform";

type MatchableJobPlatform = Pick<JobPlatformEntity, "id" | "name">;

function normalizePlatformName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "");
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function matchPlatformByHostname(url: string, platforms: MatchableJobPlatform[]): string | null {
  const hostname = getHostname(url);
  if (!hostname) return null;

  const matchedIds = new Set<string>();
  for (const platform of platforms) {
    const normalizedName = normalizePlatformName(platform.name);
    if (normalizedName && hostname.includes(normalizedName)) {
      matchedIds.add(platform.id);
    }
  }

  if (matchedIds.size !== 1) return null;
  return [...matchedIds][0] ?? null;
}
