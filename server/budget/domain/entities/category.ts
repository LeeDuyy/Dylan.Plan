export type CategoryEntity = {
  id: string;
  monthId: string;
  name: string;
  type: string;
  budget: number;
  locked: boolean;
  /** Danh mục dự phòng "Chi tiêu khác" — tự sinh khi cần, khóa vĩnh viễn (BR-009/BR-010, DEC-058). */
  isFallback: boolean;
  order: number;
};
