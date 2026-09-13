import type { NavPrefEntity } from "../entities/nav-pref";

export type NavPrefSeedInput = { id: string; order: number; hidden: boolean };

export interface NavPrefRepository {
  findAll(): Promise<NavPrefEntity[]>;
  reorder(orderedIds: string[]): Promise<void>;
  setHidden(id: string, hidden: boolean): Promise<void>;
  deleteAll(): Promise<void>;
  createMany(seeds: NavPrefSeedInput[]): Promise<void>;
  /**
   * Chèn đúng một lần bộ mặc định, atomic với chính lệnh đếm — tránh race khi
   * nhiều request đọc layout cùng lúc đều thấy bảng rỗng rồi cùng chèn (mẫu
   * JobPlatformRepository.createDefaultsIfEmpty).
   */
  createDefaultsIfEmpty(seeds: NavPrefSeedInput[]): Promise<void>;
  /**
   * Chèn các seed mà id chưa có trong bảng (bỏ qua id đã tồn tại, không ghi đè
   * order/hidden đã chỉnh) — dùng khi cấu trúc menu tĩnh thêm mục con mới.
   */
  insertMissing(seeds: NavPrefSeedInput[]): Promise<void>;
  /** Xoá mọi hàng có id không còn nằm trong danh sách id hợp lệ hiện tại. */
  deleteByIdsNotIn(ids: string[]): Promise<void>;
}
