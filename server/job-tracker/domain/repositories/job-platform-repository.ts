import type { JobPlatformEntity } from "../entities/job-platform";

export type CreateJobPlatformInput = {
  name: string;
};

export interface JobPlatformRepository {
  findAll(): Promise<JobPlatformEntity[]>;
  create(data: CreateJobPlatformInput): Promise<JobPlatformEntity>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  /**
   * Chèn đúng một lần các tên mặc định, atomic với chính lệnh đếm — tránh
   * race khi nhiều request đọc trang cùng lúc đều thấy bảng rỗng rồi cùng
   * chèn (đã tái hiện thật: 7 request đồng thời tạo 21 dòng thay vì 3).
   */
  createDefaultsIfEmpty(names: string[]): Promise<void>;
}
