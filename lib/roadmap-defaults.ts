// Dữ liệu Roadmap timeline mặc định + helper thuần — dùng chung cho server (seed bảng
// RoadmapPhase khi rỗng) và client (fallback khi chưa fetch được, + tính pha hiện tại).
// Trước US-025 GĐ3 các hằng này nằm trực tiếp trong components/PlanViews.tsx.

export type RoadmapDeliverableView = { id: string; title: string; desc: string };

export type RoadmapPhaseView = {
  id: string;
  dateRange: string; // "22/06-30/06"
  label: string;
  title: string;
  desc: string;
  deliverables: RoadmapDeliverableView[];
};

// Các mốc chỉ ghi ngày/tháng; toàn bộ kế hoạch nằm trong năm 2026.
export const ROADMAP_YEAR = 2026;

export const DEFAULT_ROADMAP_PHASES: RoadmapPhaseView[] = [
  {
    id: "seed-phase-1",
    dateRange: "22/06-30/06",
    label: "Định vị và chuẩn hóa hồ sơ",
    title: "Reset và chuẩn hóa hồ sơ",
    desc: "Chuyển kinh nghiệm thành thông điệp giá trị rõ ràng, không chỉ liệt kê công nghệ.",
    deliverables: [
      { id: "seed-1-1", title: "CV Việt + Anh", desc: "Nhấn mạnh impact, quy mô hệ thống, vai trò quản lý và khách hàng lớn." },
      { id: "seed-1-2", title: "LinkedIn hoàn chỉnh", desc: "Headline, About, project highlights và Open to Work có chọn lọc." },
      { id: "seed-1-3", title: "Career stories", desc: "Chuẩn bị 8 câu chuyện STAR về kỹ thuật, leadership và stakeholder." },
      { id: "seed-1-4", title: "Salary positioning", desc: "Xác định expected salary, mức sàn và cách giải thích giá trị." },
      { id: "seed-1-5", title: "Company list", desc: "Danh sách 30 công ty phù hợp .NET, product, outsourcing quốc tế." },
      { id: "seed-1-6", title: "Skill gap", desc: "Chấm điểm English, coding, system design, leadership và architecture." }
    ]
  },
  {
    id: "seed-phase-2",
    dateRange: "01/07-31/07",
    label: "Tăng cường năng lực phỏng vấn",
    title: "Luyện phỏng vấn",
    desc: "Biến kiến thức đã có thành khả năng trình bày ngắn gọn, logic và thuyết phục.",
    deliverables: [
      { id: "seed-2-1", title: "English daily", desc: "45-60 phút/ngày, ưu tiên nói và nghe tình huống phỏng vấn." },
      { id: "seed-2-2", title: ".NET review", desc: "ASP.NET Core, EF Core, concurrency, async, performance và security." },
      { id: "seed-2-3", title: "System design", desc: "Ít nhất 8 bài thiết kế: order, loyalty, notification, HRM, high load." },
      { id: "seed-2-4", title: "Leadership interview", desc: "Team performance, conflict, coaching, estimation và delivery risk." },
      { id: "seed-2-5", title: "Mock interview", desc: "2 buổi/tuần: một technical, một HR/English." },
      { id: "seed-2-6", title: "Warm networking", desc: "Kết nối recruiter và referral nhưng chưa ứng tuyển dàn trải." }
    ]
  },
  {
    id: "seed-phase-3",
    dateRange: "01/08-14/08",
    label: "Chạy thử quy trình ứng tuyển",
    title: "Ứng tuyển thử",
    desc: "Ứng tuyển chọn lọc để kiểm tra CV, phản hồi thị trường và điều chỉnh trước giai đoạn chính.",
    deliverables: [
      { id: "seed-3-1", title: "5-8 hồ sơ thử", desc: "Chọn công ty phù hợp nhưng chưa phải nhóm ưu tiên cao nhất." },
      { id: "seed-3-2", title: "Recruiter screening", desc: "Kiểm tra phần giới thiệu, expected salary và English communication." },
      { id: "seed-3-3", title: "Feedback loop", desc: "Ghi lại câu hỏi bị yếu và cập nhật câu trả lời ngay trong 24 giờ." },
      { id: "seed-3-4", title: "Portfolio evidence", desc: "Sơ đồ hệ thống, case study, tài liệu quy trình và sản phẩm demo." }
    ]
  },
  {
    id: "seed-phase-4",
    dateRange: "15/08-15/09",
    label: "Ứng tuyển tập trung",
    title: "Tối ưu offer 40M net",
    desc: "Tạo pipeline đủ lớn nhưng vẫn ưu tiên chất lượng và khả năng đạt mức 40 triệu net.",
    deliverables: [
      { id: "seed-4-1", title: "20-28 hồ sơ chất lượng", desc: "Ưu tiên product, outsourcing quốc tế, team có stack .NET hoặc cloud." },
      { id: "seed-4-2", title: "Interview pipeline", desc: "Theo dõi vòng HR, technical, system design, leadership và client." },
      { id: "seed-4-3", title: "Offer comparison", desc: "So sánh net salary, bonus, role scope, môi trường, learning và work-life balance." },
      { id: "seed-4-4", title: "Mục tiêu cuối", desc: "Nhận offer phù hợp ở mức 40 triệu net hoặc tổng package tương đương." }
    ]
  }
];

export type PhaseState = "active" | "upcoming" | "done";

export const PHASE_STATE_LABEL: Record<PhaseState, string> = {
  active: "Giai đoạn hiện tại",
  upcoming: "Giai đoạn kế tiếp",
  done: "Giai đoạn cuối"
};

// "22/06-30/06" -> khoảng ngày trong ROADMAP_YEAR. Trả null nếu format sai.
export function parsePhaseRange(range: string): { start: Date; end: Date } | null {
  const match = /^(\d{1,2})\/(\d{1,2})-(\d{1,2})\/(\d{1,2})$/.exec(range.trim());
  if (!match) return null;
  const [, fromDay, fromMonth, toDay, toMonth] = match.map(Number);
  return {
    start: new Date(ROADMAP_YEAR, fromMonth - 1, fromDay),
    end: new Date(ROADMAP_YEAR, toMonth - 1, toDay, 23, 59, 59)
  };
}

// Pha ứng với hôm nay: đang chạy, sắp tới, hoặc (đã qua mốc cuối) giữ pha cuối.
export function resolveActivePhase(
  today: Date,
  phases: RoadmapPhaseView[]
): { phase: RoadmapPhaseView; state: PhaseState } | null {
  if (phases.length === 0) return null;
  const ranges = phases.map((phase) => ({ phase, range: parsePhaseRange(phase.dateRange) }));
  const active = ranges.find(({ range }) => range && today >= range.start && today <= range.end);
  if (active) return { phase: active.phase, state: "active" };
  const upcoming = ranges.find(({ range }) => range && today < range.start);
  if (upcoming) return { phase: upcoming.phase, state: "upcoming" };
  return { phase: phases[phases.length - 1], state: "done" };
}
