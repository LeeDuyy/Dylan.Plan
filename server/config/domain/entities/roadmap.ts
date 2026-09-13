import type { RoadmapPhaseView } from "@/lib/roadmap-defaults";

// Entity roadmap = đúng shape View dùng ở UI (id + dateRange + label/title/desc +
// deliverables đã sắp thứ tự). Không có hành vi, chỉ là DTO.
export type RoadmapPhaseEntity = RoadmapPhaseView;
export type RoadmapDeliverableEntity = RoadmapPhaseView["deliverables"][number];
