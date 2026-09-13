import type { PageBlockEntity, PageContentEntity, PageTextEntity } from "./entities";

export type PageBlockSeed = Omit<PageBlockEntity, "id">;

export type UpsertPageBlockInput = {
  id?: string;
  page: string;
  section: string;
  badge?: string | null;
  title?: string | null;
  desc?: string | null;
  value?: string | null;
  weight?: number | null;
  variant?: string | null;
  bullets?: string | null;
};

export interface PageContentRepository {
  findByPage(page: string): Promise<PageContentEntity>;
  countByPage(page: string): Promise<number>;
  /**
   * Chèn seed mặc định đúng một lần, atomic với chính lệnh đếm — tránh race khi
   * nhiều request đọc trang cùng lúc đều thấy bảng rỗng rồi cùng chèn (mẫu
   * NavPrefRepository.createDefaultsIfEmpty).
   */
  createDefaultsIfEmpty(page: string, texts: PageTextEntity[], blocks: PageBlockSeed[]): Promise<void>;
  upsertText(page: string, key: string, value: string): Promise<void>;
  upsertBlock(input: UpsertPageBlockInput): Promise<PageBlockEntity>;
  deleteBlock(id: string): Promise<void>;
  reorderBlocks(page: string, section: string, orderedIds: string[]): Promise<void>;
  /** Xoá toàn bộ text + block của trang rồi chèn lại đúng seed mặc định. */
  resetPage(page: string, texts: PageTextEntity[], blocks: PageBlockSeed[]): Promise<void>;
}
