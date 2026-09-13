import { BriefcaseBusiness, CalendarClock, Handshake, PanelsTopLeft, ShoppingBag, WalletCards } from "lucide-react";
import type { ComponentType } from "react";

import { groupPrefId, leafPrefId, type NavPref } from "@/lib/nav-registry";

export type NavLeaf = { href: string; label: string; desc?: string };

export type NavGroup = {
  // ID ổn định, khớp NAV_GROUP_IDS trong lib/nav-registry.ts (dùng cho NavPref).
  id: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  // Đích khi bấm vào chính mục cha (mục lá: là trang của nó; mục có submenu:
  // section con đầu tiên).
  href: string;
  // Mô tả ngắn hiển thị dưới tiêu đề trên header cố định (chỉ dùng cho mục lá).
  desc?: string;
  // Tiền tố path để xác định mục cha nào đang active / cần mở sẵn.
  match: (pathname: string) => boolean;
  // Rỗng nghĩa là mục lá, không có submenu.
  children: NavLeaf[];
};

export const navGroups: NavGroup[] = [
  {
    id: "overview",
    label: "Tổng quan",
    icon: PanelsTopLeft,
    href: "/",
    desc: "Giai đoạn roadmap hiện tại và trạng thái pipeline ứng tuyển. Chi tiết ngân sách nằm ở tab Thu chi.",
    match: (p) => p === "/",
    children: []
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: BriefcaseBusiness,
    href: "/roadmap/timeline",
    match: (p) => p === "/roadmap" || p.startsWith("/roadmap/"),
    children: [
      {
        href: "/roadmap/timeline",
        label: "Lộ trình thực hiện",
        desc: "Mỗi giai đoạn có đầu ra rõ ràng trước khi chuyển sang ứng tuyển số lượng lớn."
      },
      {
        href: "/roadmap/priorities",
        label: "Ưu tiên hiện tại",
        desc: "Trong giai đoạn 22/06-15/09, chuyển việc là ưu tiên tuyệt đối; freelance và sản phẩm chỉ hỗ trợ portfolio."
      },
      {
        href: "/roadmap/jobs",
        label: "Theo dõi CV ứng tuyển",
        desc: "Theo dõi vòng nộp, phản hồi và lịch phỏng vấn của từng hồ sơ."
      },
      {
        href: "/roadmap/first-week",
        label: "Kế hoạch tuần đầu",
        desc: "Tạo nhịp bền vững, hoàn tất nền tảng hồ sơ và bắt đầu luyện nói đều."
      },
      {
        href: "/roadmap/weekly-kpi",
        label: "KPI hằng tuần",
        desc: "Các chỉ số trung gian giúp phát hiện sớm CV, tiếng Anh hoặc kỹ thuật đang có vấn đề."
      },
      {
        href: "/roadmap/english",
        label: "Tiếng Anh & Phỏng vấn",
        desc: "Chuẩn hóa cách kể chuyện bằng tiếng Anh và luyện từng vòng phỏng vấn."
      },
      {
        href: "/roadmap/long-term",
        label: "Kế hoạch dài hạn",
        desc: "Hướng tới tổng thu nhập tối thiểu 60M/tháng mà không quá tải sau khi vừa chuyển việc."
      }
    ]
  },
  {
    id: "timetable",
    label: "Thời gian biểu",
    icon: CalendarClock,
    href: "/timetable",
    desc: "Mỗi tối chỉ một nhiệm vụ chính, tiếng Anh ngắn hằng ngày và ít nhất một buổi nghỉ hoàn toàn.",
    match: (p) => p === "/timetable" || p.startsWith("/timetable/"),
    children: []
  },
  {
    id: "freelance",
    label: "Freelance",
    icon: Handshake,
    href: "/freelance/strategy",
    match: (p) => p === "/freelance" || p.startsWith("/freelance/"),
    children: [
      {
        href: "/freelance/strategy",
        label: "Chiến lược Buy to Build",
        desc: "Không build platform lớn trước khi có tín hiệu mua; bán gói nhỏ, lấy feedback, rồi chuẩn hóa phần lặp lại."
      },
      {
        href: "/freelance/process",
        label: "Quy trình & bộ lọc dự án",
        desc: "Mỗi lead phải kiểm chứng khách có thật sự cần, có sẵn sàng trả tiền và phần nào có thể reuse."
      },
      {
        href: "/freelance/kpi",
        label: "KPI theo tuần",
        desc: "Trước offer mới, KPI freelance chỉ đo tín hiệu thị trường."
      }
    ]
  },
  {
    id: "product",
    label: "Sản phẩm",
    icon: ShoppingBag,
    href: "/product/positioning",
    match: (p) => p === "/product" || p.startsWith("/product/"),
    children: [
      {
        href: "/product/positioning",
        label: "Định vị MVP",
        desc: "Tạo bộ template bán hàng nhỏ dùng cho shop của bạn, sau đó tái sử dụng cho khách freelance theo Buy to Build."
      },
      {
        href: "/product/scope",
        label: "Module cần có",
        desc: "Chỉ build những phần giúp demo, bán gói nhỏ hoặc reuse cho khách sau."
      },
      {
        href: "/product/timeline",
        label: "Lộ trình 8 tuần",
        desc: "Nếu tuần nào có phỏng vấn, ưu tiên phỏng vấn và đẩy sản phẩm sang cuối tuần."
      },
      {
        href: "/product/kpi",
        label: "KPI sản phẩm",
        desc: "KPI đúng là demo có dùng được không, có ai quan tâm không, và có phần nào lặp lại để product hóa không."
      }
    ]
  },
  {
    id: "budget",
    label: "Thu chi",
    icon: WalletCards,
    href: "/budget/monthly",
    match: (p) => p === "/budget" || p.startsWith("/budget/"),
    children: [
      {
        href: "/budget/monthly",
        label: "Lịch sử thu chi",
        desc: "Mỗi tháng có dữ liệu riêng. Tạo tháng mới sẽ sao chép kế hoạch ngân sách và reset chi thực tế về 0."
      },
      {
        href: "/budget/insight",
        label: "Insight tài chính",
        desc: "Nhìn nhanh danh mục chi nhiều nhất, khả năng tiết kiệm và xu hướng qua các tháng."
      },
      {
        href: "/budget/income",
        label: "Quản lý thu",
        desc: "Khai báo nguồn thu trong tháng và xem nhanh các khoản đã để dành."
      },
      {
        href: "/budget/expense",
        label: "Quản lý chi",
        desc: 'Gõ tự nhiên như "cafe 45k", "grab 80k", "ăn trưa 65000"; app tự nhận diện số tiền và danh mục.'
      }
    ]
  }
];

export function activeGroup(pathname: string, groups: NavGroup[] = navGroups): NavGroup | undefined {
  return groups.find((group) => group.match(pathname));
}

// Tiêu đề + mô tả hiển thị trên thanh header cố định. Luôn tra trên `navGroups` đầy đủ
// để mục cha đang bị ẩn khỏi menu vẫn cho ra tiêu đề đúng khi truy cập route trực tiếp.
export function currentMeta(pathname: string): { title: string; desc?: string } {
  const group = activeGroup(pathname, navGroups);
  if (!group) return { title: "Dylan Plan" };
  const child = group.children.find((leaf) => leaf.href === pathname);
  if (child) return { title: `${group.label} · ${child.label}`, desc: child.desc };
  return { title: group.label, desc: group.desc };
}

// Áp preference (thứ tự + ẩn/hiện) từ DB lên cây nav tĩnh: sắp xếp và lọc nhóm cha,
// rồi sắp xếp và lọc section con trong từng nhóm. Nhóm/section thiếu pref → giữ thứ tự
// gốc, không ẩn.
export function applyNavPrefs(groups: NavGroup[], prefs: NavPref[]): NavGroup[] {
  const prefById = new Map(prefs.map((pref) => [pref.id, pref]));
  const orderOf = (id: string, fallback: number) => prefById.get(id)?.order ?? fallback;
  const isHidden = (id: string) => prefById.get(id)?.hidden ?? false;

  return groups
    .map((group, index) => ({ group, index }))
    .filter(({ group }) => !isHidden(groupPrefId(group.id)))
    .sort((a, b) => orderOf(groupPrefId(a.group.id), a.index) - orderOf(groupPrefId(b.group.id), b.index))
    .map(({ group }) => ({
      ...group,
      children: group.children
        .map((child, index) => ({ child, index }))
        .filter(({ child }) => !isHidden(leafPrefId(child.href)))
        .sort((a, b) => orderOf(leafPrefId(a.child.href), a.index) - orderOf(leafPrefId(b.child.href), b.index))
        .map(({ child }) => child)
    }));
}
