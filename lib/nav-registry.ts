// Cấu trúc điều hướng ở dạng thuần dữ liệu (không icon, không hàm) — dùng chung cho
// UI (components/shared/nav.ts) và server (server/config: seed NavPref + validate reorder).
// `components/shared/nav.ts` là nguồn sự thật cho nội dung (label/desc/icon/match);
// file này chỉ giữ ID + thứ tự mặc định.

export const NAV_GROUP_IDS = ["overview", "roadmap", "timetable", "freelance", "product", "budget"] as const;
export type NavGroupId = (typeof NAV_GROUP_IDS)[number];

// href các section con theo từng nhóm, đúng thứ tự mặc định trong nav.ts.
export const NAV_CHILD_HREFS: Record<NavGroupId, string[]> = {
  overview: [],
  roadmap: [
    "/roadmap/timeline",
    "/roadmap/priorities",
    "/roadmap/jobs",
    "/roadmap/first-week",
    "/roadmap/weekly-kpi",
    "/roadmap/english",
    "/roadmap/long-term"
  ],
  timetable: [],
  freelance: ["/freelance/strategy", "/freelance/process", "/freelance/kpi"],
  product: ["/product/positioning", "/product/scope", "/product/timeline", "/product/kpi"],
  budget: ["/budget/monthly", "/budget/insight", "/budget/control"]
};

export type NavPref = { id: string; order: number; hidden: boolean };

export const groupPrefId = (groupId: string) => `group:${groupId}`;
export const leafPrefId = (href: string) => `leaf:${href}`;

// Danh sách (id, order, hidden) mặc định để seed bảng NavPref.
export function defaultNavPrefSeeds(): NavPref[] {
  const seeds: NavPref[] = [];
  NAV_GROUP_IDS.forEach((groupId, groupIndex) => {
    seeds.push({ id: groupPrefId(groupId), order: groupIndex, hidden: false });
    NAV_CHILD_HREFS[groupId].forEach((href, childIndex) => {
      seeds.push({ id: leafPrefId(href), order: childIndex, hidden: false });
    });
  });
  return seeds;
}

export const ALL_NAV_PREF_IDS: string[] = defaultNavPrefSeeds().map((seed) => seed.id);

// Xác định "phạm vi anh em" của một danh sách id được kéo sắp xếp:
// - toàn "group:*" → phải khớp đúng toàn bộ nhóm cha
// - toàn "leaf:*"  → phải khớp đúng toàn bộ con của MỘT nhóm
export function resolveReorderScope(
  orderedIds: string[]
):
  | { kind: "groups"; expected: string[] }
  | { kind: "children"; groupId: NavGroupId; expected: string[] }
  | null {
  if (orderedIds.length === 0) return null;
  if (orderedIds.every((id) => id.startsWith("group:"))) {
    return { kind: "groups", expected: NAV_GROUP_IDS.map(groupPrefId) };
  }
  if (orderedIds.every((id) => id.startsWith("leaf:"))) {
    const first = orderedIds[0];
    const groupId = (Object.keys(NAV_CHILD_HREFS) as NavGroupId[]).find((gid) =>
      NAV_CHILD_HREFS[gid].map(leafPrefId).includes(first)
    );
    if (!groupId) return null;
    return { kind: "children", groupId, expected: NAV_CHILD_HREFS[groupId].map(leafPrefId) };
  }
  return null;
}
