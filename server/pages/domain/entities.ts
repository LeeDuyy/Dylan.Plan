// Nội dung trang Roadmap/Freelance/Sản phẩm sửa được qua nút "Chỉnh sửa trang"
// (US-027). Không có model riêng theo loại trang — `page` (route rút gọn, vd
// "roadmap/priorities") là tham số phân biệt, dùng chung 2 bảng cho mọi trang.

export type PageTextEntity = {
  page: string;
  key: string;
  value: string;
};

export type PageBlockEntity = {
  id: string;
  page: string;
  section: string;
  order: number;
  badge: string | null;
  title: string | null;
  desc: string | null;
  value: string | null;
  weight: number | null;
  variant: string | null;
  // Mảng chuỗi JSON-encode (gạch đầu dòng con) — SQLite không có kiểu mảng gốc.
  bullets: string | null;
};

export type PageContentEntity = {
  texts: PageTextEntity[];
  blocks: PageBlockEntity[];
};
