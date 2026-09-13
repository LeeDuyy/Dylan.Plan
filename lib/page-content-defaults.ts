// Nội dung mặc định (seed) cho các trang Roadmap/Freelance/Sản phẩm sửa được qua
// nút "Chỉnh sửa trang" (US-027, model PageText + PageBlock). Copy y hệt bản
// hardcode cũ trong components/PlanViews.tsx — chuyển sang DB không đổi nội dung
// hiển thị, chỉ đổi nguồn dữ liệu.
//
// `page` dùng làm khoá: route rút gọn không có dấu "/" đầu, vd "roadmap/priorities".

export type PageBlockDefault = {
  badge?: string;
  title?: string;
  desc?: string;
  value?: string;
  weight?: number;
  variant?: string;
  bullets?: string[];
};

export type PageContentDefault = {
  texts: Record<string, string>;
  blocks: Record<string, PageBlockDefault[]>;
};

export type PageTextView = Record<string, string>;
export type PageBlockView = { id: string } & PageBlockDefault;
export type PageContentView = {
  texts: PageTextView;
  blocks: Record<string, PageBlockView[]>;
};

// Danh sách page hợp lệ (dùng để validate + seed) — đúng route trong nav.ts, trừ
// roadmap/timeline (đã có model riêng từ US-025) và roadmap/jobs (dữ liệu động,
// không phải nội dung tĩnh).
export const EDITABLE_PAGE_KEYS = [
  "roadmap/priorities",
  "roadmap/first-week",
  "roadmap/weekly-kpi",
  "roadmap/english",
  "roadmap/long-term",
  "freelance/strategy",
  "freelance/process",
  "freelance/kpi",
  "product/positioning",
  "product/scope",
  "product/timeline",
  "product/kpi"
] as const;

export type EditablePageKey = (typeof EDITABLE_PAGE_KEYS)[number];

export const PAGE_TITLES: Record<EditablePageKey, string> = {
  "roadmap/priorities": "Ưu tiên hiện tại",
  "roadmap/first-week": "Kế hoạch tuần đầu",
  "roadmap/weekly-kpi": "KPI hằng tuần",
  "roadmap/english": "Tiếng Anh & Phỏng vấn",
  "roadmap/long-term": "Kế hoạch dài hạn",
  "freelance/strategy": "Chiến lược Buy to Build",
  "freelance/process": "Quy trình & bộ lọc dự án",
  "freelance/kpi": "KPI theo tuần",
  "product/positioning": "Định vị MVP",
  "product/scope": "Module cần có",
  "product/timeline": "Lộ trình 8 tuần",
  "product/kpi": "KPI sản phẩm"
};

export const DEFAULT_PAGE_CONTENT: Record<EditablePageKey, PageContentDefault> = {
  "roadmap/priorities": {
    texts: {},
    blocks: {
      default: [
        {
          title: "Chuyển việc",
          value: "55%",
          desc: "CV, hồ sơ, networking, ứng tuyển, mock interview và xử lý offer.",
          weight: 100
        },
        {
          title: "Tiếng Anh",
          value: "30%",
          desc: "Giao tiếp nghề nghiệp, tự giới thiệu, kể dự án và trả lời phỏng vấn.",
          weight: 67
        },
        {
          title: "Sản phẩm",
          value: "10%",
          desc: "Xây base template và module có thể tái sử dụng cho khách freelance.",
          weight: 34
        },
        {
          title: "Freelance",
          value: "5%",
          desc: "Chỉ tìm lead, demo, báo giá mẫu; chưa ưu tiên nhận dự án delivery thật trước khi có offer.",
          weight: 23
        }
      ]
    }
  },

  "roadmap/first-week": {
    texts: {},
    blocks: {
      default: [
        { value: "CV", desc: "Hoàn tất bản CV tiếng Việt + outline CV tiếng Anh" },
        { value: "LinkedIn", desc: "Cập nhật headline, about và 3 project highlights" },
        { value: "5 buổi", desc: "English speaking 20-30 phút, ưu tiên self-intro và project story" },
        { value: "2 stories", desc: "Viết 2 câu chuyện STAR: technical challenge và leadership" },
        { value: "1 design", desc: "Ôn và trình bày 1 system design từ dự án thật" },
        { value: "10 công ty", desc: "Lập danh sách công ty mục tiêu và lý do phù hợp" },
        { value: "0 delivery", desc: "Không nhận freelance delivery trong tuần đầu" },
        { value: "CN", desc: "Chấm scorecard và điều chỉnh lịch tuần sau" }
      ]
    }
  },

  "roadmap/weekly-kpi": {
    texts: {},
    blocks: {
      default: [
        { value: "5", desc: "Buổi English speaking ngắn mỗi tuần" },
        { value: "2", desc: "Buổi mock/review phỏng vấn mỗi tuần" },
        { value: "2", desc: "Case system design hoặc technical story mỗi tuần" },
        { value: "1", desc: "Cập nhật CV/LinkedIn/pipeline mỗi tuần" },
        { value: "30", desc: "Công ty mục tiêu được nghiên cứu trước 15/08" },
        { value: "20-28", desc: "Hồ sơ chất lượng trong chiến dịch 15/08-15/09" },
        { value: "5-8", desc: "Quy trình phỏng vấn chuyên môn kỳ vọng" },
        { value: "1-2", desc: "Offer để so sánh và thương lượng" }
      ]
    }
  },

  "roadmap/english": {
    texts: {
      "topics.eyebrow": "Tiếng Anh",
      "topics.title": "Kế hoạch tiếng Anh",
      "rounds.eyebrow": "Phỏng vấn",
      "rounds.title": "Các vòng phỏng vấn",
      "scorecard.eyebrow": "Đánh giá",
      "scorecard.title": "Scorecard",
      "scorecard.desc": "Mỗi Chủ nhật chấm 1-10; mục tiêu trước 15/08 là không còn điểm yếu nghiêm trọng."
    },
    blocks: {
      topics: [
        { badge: "1", title: "Self-introduction", desc: "60 giây, 2 phút và 5 phút cho các tình huống khác nhau." },
        {
          badge: "2",
          title: "Project explanation",
          desc: "Bối cảnh, kiến trúc, thách thức, vai trò và kết quả định lượng."
        },
        {
          badge: "3",
          title: "Technical reasoning",
          desc: "Giải thích vì sao chọn Kafka, Redis, microservices, indexing hoặc caching."
        },
        {
          badge: "4",
          title: "Leadership stories",
          desc: "Conflict, underperformance, delivery pressure, mentoring và stakeholder."
        },
        { badge: "5", title: "Salary & motivation", desc: "Lý do chuyển việc, kỳ vọng vai trò và thương lượng package." }
      ],
      rounds: [
        { title: "HR / Recruiter", desc: "Giới thiệu, động lực chuyển việc, English, expected salary và notice period." },
        { title: "Technical depth", desc: ".NET, Angular, database, performance, distributed systems và debugging." },
        { title: "System design", desc: "Scale, reliability, consistency, security, observability và trade-off." },
        { title: "Leadership / Client", desc: "Quản lý team, delivery, BA/PO/QC, khách hàng và giải quyết xung đột." }
      ],
      scorecard: [
        { value: "8/10", desc: "English speaking" },
        { value: "8/10", desc: ".NET & architecture" },
        { value: "8/10", desc: "System design" },
        { value: "8/10", desc: "Leadership stories" },
        { value: "9/10", desc: "CV & positioning" }
      ]
    }
  },

  "roadmap/long-term": {
    texts: {
      "income.eyebrow": "Cơ cấu mục tiêu",
      "income.total": "≥ 60M / tháng",
      "income.desc":
        "Lương mới vẫn là nền tảng. Freelance tăng trưởng theo Buy to Build; sản phẩm chỉ mở rộng khi có khách.",
      "scenarios.eyebrow": "Kịch bản",
      "scenarios.title": "Ba phương án thu nhập",
      "risk.eyebrow": "Điều kiện",
      "risk.title": "Kiểm soát rủi ro",
      "risk.desc":
        "Thu nhập tăng chỉ có ý nghĩa khi không làm giảm hiệu suất công việc chính, sức khỏe và khả năng duy trì lâu dài."
    },
    blocks: {
      income: [
        { title: "Lương chính", value: "40-45M net", weight: 70, variant: "" },
        { title: "Freelance", value: "10-15M", weight: 20, variant: "progress-warn" },
        { title: "Sản phẩm", value: "0-5M ban đầu", weight: 10, variant: "progress-success" }
      ],
      scenarios: [
        { title: "An toàn", value: "55-60M", desc: "45 + 10 + 0-5" },
        { title: "Cân bằng", value: "57-60M", desc: "42 + 12 + 3-6" },
        { title: "Tăng trưởng", value: "60M", desc: "40 + 15 + 5" }
      ],
      risk: [
        { value: "≤ 10h/tuần", desc: "Tổng thời gian dành cho freelance và sản phẩm sau khi đổi việc" },
        { value: "1 dự án/lần", desc: "Không nhận đồng thời nhiều dự án custom" },
        { value: "≥ 80% reuse", desc: "Mỗi dự án dùng lại phần lớn template và module sẵn có" },
        { value: "Doanh thu lặp lại", desc: "Ưu tiên setup + maintenance/hosting thay vì chỉ thu một lần" }
      ]
    }
  },

  "freelance/strategy": {
    texts: {
      "ratio.eyebrow": "Chiến lược chính",
      "ratio.title": "80% Buy to Build · 20% Build to Buy",
      "ratio.desc": "Ưu tiên lead, demo, báo giá và delivery nhỏ; chỉ refactor phần đã có tín hiệu lặp lại.",
      "ratio.percent": "80",
      "principles.eyebrow": "Nguyên tắc",
      "principles.title": "Không build khi chưa có tín hiệu mua"
    },
    blocks: {
      ratio: [
        { title: "80% Buy to Build", desc: "Lead, demo, báo giá, delivery nhỏ" },
        { title: "20% Build to Buy", desc: "Refactor, config, module dùng chung" }
      ],
      principles: [
        { badge: "1", title: "Bán kết quả, không bán giờ", desc: "Scope, giá, milestone và số lần sửa phải đóng gói từ đầu." },
        {
          badge: "2",
          title: "Reuse tối thiểu 80%",
          desc: "Chỉ nhận việc có thể dùng lại template/admin/module hiện có."
        },
        {
          badge: "3",
          title: "Platform hóa sau khi lặp lại",
          desc: "Một feature nên xuất hiện ở ít nhất 2-3 khách hàng trước khi đưa vào core."
        }
      ],
      services: [
        {
          badge: "GÓI 01 · ENTRY",
          title: "Landing Page",
          desc: "Dành cho shop cần trang giới thiệu, chạy quảng cáo và nhận liên hệ.",
          bullets: ["1 template responsive", "CTA Zalo / Facebook", "SEO và deploy cơ bản", "Thời gian: 3-5 ngày"]
        },
        {
          badge: "GÓI 02 · CORE",
          title: "Website bán hàng",
          desc: "Website sản phẩm, giỏ hàng COD và admin quản lý nội dung.",
          bullets: [
            "Catalog và chi tiết sản phẩm",
            "Giỏ hàng và đặt hàng",
            "Admin sản phẩm / đơn hàng",
            "Thời gian: 7-10 ngày nếu dùng template"
          ]
        },
        {
          badge: "GÓI 03 · SCOPE RÕ",
          title: "Admin nội bộ nhỏ",
          desc: "Chuyển quy trình Excel thủ công thành hệ thống quản lý gọn nhẹ.",
          bullets: ["Đơn hàng và khách hàng", "Dashboard cơ bản", "Import / export Excel", "Chỉ nhận khi scope rõ"]
        }
      ]
    }
  },

  "freelance/process": {
    texts: {
      "gate.eyebrow": "Bộ lọc dự án",
      "gate.title": "Nhận hay từ chối",
      "gate.desc":
        "Áp dụng bộ lọc này trước khi báo giá để tránh biến freelance thành công việc toàn thời gian thứ hai.",
      "gate.acceptTitle": "Nên nhận",
      "gate.rejectTitle": "Nên từ chối"
    },
    blocks: {
      flow: [
        { badge: "1", title: "Tìm lead", desc: "Người quen, Facebook, shop handmade và phụ kiện." },
        { badge: "2", title: "Demo", desc: "Cho khách xem template thật thay vì giải thích công nghệ." },
        { badge: "3", title: "Chốt scope", desc: "Đầu ra, số lần sửa, milestone, phí setup và phí duy trì." },
        {
          badge: "4",
          title: "Delivery nhỏ",
          desc: "Chỉ triển khai nếu hoàn thành được trong 3-10 ngày và reuse cao."
        },
        {
          badge: "5",
          title: "Product hóa",
          desc: "Đưa yêu cầu lặp lại thành config, template hoặc module dùng chung."
        }
      ],
      accept: [
        { desc: "Scope rõ, ít thay đổi và hoàn thành trong 3-10 ngày." },
        { desc: "Có thể reuse template, admin hoặc module hiện có." },
        { desc: "Khách chấp nhận quy trình, milestone và giới hạn số lần sửa." },
        { desc: "Dự án tạo case study, testimonial hoặc insight lặp lại cho sản phẩm." }
      ],
      reject: [
        { desc: "Deadline gấp, cần hỗ trợ liên tục hoặc họp quá nhiều." },
        { desc: "Custom sâu, workflow phức tạp hoặc không liên quan đến nhóm shop mục tiêu." },
        { desc: "Khách chưa rõ yêu cầu nhưng muốn báo giá cố định ngay." },
        { desc: "Ảnh hưởng lịch học tiếng Anh, mock interview hoặc công việc chính." }
      ]
    }
  },

  "freelance/kpi": {
    texts: {},
    blocks: {
      default: [
        { value: "3-5", desc: "Lead phù hợp được tiếp cận" },
        { value: "1-2", desc: "Cuộc trao đổi nhu cầu" },
        { value: "1", desc: "Demo hoặc báo giá mẫu gửi đi" },
        { value: "1", desc: "Pattern/insight được ghi lại" },
        { value: "≥ 80%", desc: "Tỷ lệ code/template có thể tái sử dụng" },
        { value: "≤ 4h", desc: "Thời gian freelance mỗi tuần trước offer" }
      ]
    }
  },

  "product/positioning": {
    texts: {
      "stack.eyebrow": "Định vị MVP",
      "stack.title": "Mini Shop Builder cho shop nhỏ",
      "principles.eyebrow": "Nguyên tắc build",
      "principles.title": "Build nhỏ, dùng được ngay"
    },
    blocks: {
      stack: [
        {
          title: "Khách mục tiêu",
          desc: "Shop handmade, vòng đá, phụ kiện, mỹ phẩm nhỏ, local brand mới bắt đầu."
        },
        {
          title: "Vấn đề",
          desc: "Shop cần website riêng để tăng độ tin cậy nhưng không đủ ngân sách làm hệ thống custom."
        },
        {
          title: "Giải pháp",
          desc: "Template đẹp + admin đơn giản + deploy nhanh + phí setup/bảo trì rõ ràng."
        },
        {
          title: "Không làm vội",
          desc: "Thanh toán online, đa tenant phức tạp, subscription automation, marketplace plugin."
        }
      ],
      principles: [
        {
          badge: "1",
          title: "Ưu tiên demo thật",
          desc: "Website đầu tiên nên phục vụ shop/vòng đá của bạn để có dữ liệu thật và hình ảnh thật."
        },
        {
          badge: "2",
          title: "Config trước custom",
          desc: "Màu, logo, banner, danh mục, sản phẩm, CTA chỉnh bằng config/admin thay vì sửa code."
        },
        {
          badge: "3",
          title: "Không vượt 4-5 giờ/tuần",
          desc: "Trước 15/09, sản phẩm là portfolio và tài sản tái sử dụng, không cạnh tranh với mục tiêu offer."
        }
      ]
    }
  },

  "product/scope": {
    texts: {},
    blocks: {
      default: [
        {
          badge: "01 · PUBLIC SITE",
          title: "Landing + Catalog",
          desc: "Trang chủ, banner, câu chuyện thương hiệu, danh sách sản phẩm, chi tiết sản phẩm và CTA Zalo/Facebook."
        },
        {
          badge: "02 · ORDER",
          title: "Đặt hàng đơn giản",
          desc: "Form thông tin khách, sản phẩm quan tâm, ghi chú, trạng thái đơn ở mức cơ bản. Ưu tiên COD/manual confirm."
        },
        {
          badge: "03 · ADMIN",
          title: "Quản trị nội dung",
          desc: "CRUD sản phẩm, danh mục, ảnh, giá, trạng thái hiển thị, đơn hàng và thông tin liên hệ."
        },
        {
          badge: "04 · REUSE",
          title: "Theme Config",
          desc: "Cấu hình màu, logo, font, social link, thông tin shop và banner để clone cho khách mới nhanh hơn."
        }
      ]
    }
  },

  "product/timeline": {
    texts: {},
    blocks: {
      default: [
        {
          badge: "W1 · 22/06-28/06",
          title: "Đóng scope",
          bullets: [
            "Chọn niche đầu tiên: shop vòng đá/handmade.",
            "Vẽ sitemap và user flow mua hàng.",
            "Chốt 1 template UI chính.",
            "Output: Product brief 1 trang."
          ]
        },
        {
          badge: "W2 · 29/06-05/07",
          title: "Public demo",
          bullets: [
            "Làm landing page + catalog tĩnh.",
            "Chuẩn bị ảnh, nội dung, CTA.",
            "Deploy bản demo đầu tiên.",
            "Output: Link demo có thể gửi khách."
          ]
        },
        {
          badge: "W3 · 06/07-12/07",
          title: "Catalog động",
          bullets: [
            "Thiết kế entity Product, Category, Image.",
            "Làm API và màn admin sản phẩm cơ bản.",
            "Hiển thị dữ liệu thật trên public site.",
            "Output: CRUD sản phẩm dùng được."
          ]
        },
        {
          badge: "W4 · 13/07-19/07",
          title: "Order MVP",
          bullets: [
            "Form đặt hàng/quan tâm sản phẩm.",
            "Admin xem và đổi trạng thái đơn.",
            "Thông báo đơn mới qua email/Zalo manual.",
            "Output: Flow đặt hàng end-to-end."
          ]
        },
        {
          badge: "W5 · 20/07-26/07",
          title: "Theme config",
          bullets: [
            "Tách logo, màu, banner, social link thành config.",
            "Chuẩn hóa seed data cho shop mới.",
            "Viết checklist clone website.",
            "Output: Clone được trong 1 ngày."
          ]
        },
        {
          badge: "W6 · 27/07-02/08",
          title: "Case study",
          bullets: [
            "Viết case study: vấn đề, giải pháp, màn hình, thời gian triển khai.",
            "Tạo bảng báo giá 3 gói.",
            "Chuẩn bị demo script 5 phút.",
            "Output: Portfolio dùng cho freelance."
          ]
        },
        {
          badge: "W7 · 03/08-09/08",
          title: "Validate",
          bullets: [
            "Gửi demo cho 5-10 shop/người quen.",
            "Ghi lại câu hỏi và objection.",
            "Không sửa theo từng người ngay.",
            "Output: Danh sách pattern nhu cầu."
          ]
        },
        {
          badge: "W8 · 10/08-14/08",
          title: "Freeze trước apply",
          bullets: [
            "Chỉ fix bug, không thêm feature lớn.",
            "Chọn 1-2 phần có thể reuse cao nhất.",
            "Đóng gói demo để phục vụ phỏng vấn/portfolio.",
            "Output: MVP ổn định trước chiến dịch apply."
          ]
        }
      ]
    }
  },

  "product/kpi": {
    texts: {},
    blocks: {
      default: [
        { value: "1", desc: "Demo public chạy ổn định" },
        { value: "5-10", desc: "Shop/người quen xem demo" },
        { value: "3+", desc: "Nhu cầu lặp lại được ghi nhận" },
        { value: "1", desc: "Bảng báo giá 3 gói" },
        { value: "≤ 5h", desc: "Thời gian build mỗi tuần trước offer" }
      ]
    }
  }
};

export function isEditablePageKey(value: string): value is EditablePageKey {
  return (EDITABLE_PAGE_KEYS as readonly string[]).includes(value);
}

type RawPageContent = {
  texts: { key: string; value: string }[];
  blocks: {
    id: string;
    section: string;
    badge: string | null;
    title: string | null;
    desc: string | null;
    value: string | null;
    weight: number | null;
    variant: string | null;
    bullets: string | null;
  }[];
};

// DB là nguồn dữ liệu (đã seed lười từ DEFAULT_PAGE_CONTENT — xem
// server/pages/domain/service.ts::ensureDefaults), nhưng vẫn merge với default
// làm nền: key text thiếu (chưa seed kịp) hoặc section rỗng (xoá hết item) vẫn
// có giá trị/khung hợp lý thay vì mất hẳn khỏi UI.
export function toPageContentView(page: EditablePageKey, entity: RawPageContent): PageContentView {
  const defaults = DEFAULT_PAGE_CONTENT[page];

  const texts: PageTextView = { ...defaults.texts };
  for (const item of entity.texts) texts[item.key] = item.value;

  const blocks: Record<string, PageBlockView[]> = {};
  for (const section of Object.keys(defaults.blocks)) blocks[section] = [];
  for (const row of entity.blocks) {
    const list = blocks[row.section] ?? (blocks[row.section] = []);
    list.push({
      id: row.id,
      badge: row.badge ?? undefined,
      title: row.title ?? undefined,
      desc: row.desc ?? undefined,
      value: row.value ?? undefined,
      weight: row.weight ?? undefined,
      variant: row.variant ?? undefined,
      bullets: row.bullets ? (JSON.parse(row.bullets) as string[]) : undefined
    });
  }

  return { texts, blocks };
}
