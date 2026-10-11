"use client";

import { Button, Drawer } from "@vn-dylan/ui";
import { Pencil } from "lucide-react";
import { useState } from "react";

import { PageContentEditor } from "@/components/shared/PageContentEditor";
import type { EditablePageKey, PageContentView } from "@/lib/page-content-defaults";

// Nút "Chỉnh sửa trang" (US-027) cho các trang Roadmap/Freelance/Sản phẩm — đặt trong
// `actions` của PageHeader, mở Drawer chỉnh nội dung (text + danh sách item) mà không cần
// đổi code. Layout trang giữ nguyên, chỉ đổi dữ liệu hiển thị.
export function PageEditButton({
  page,
  title,
  content
}: {
  page: EditablePageKey;
  title: string;
  content: PageContentView;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button icon={<Pencil size={16} />} onClick={() => setOpen(true)}>
        Chỉnh sửa trang
      </Button>
      <Drawer isOpen={open} placement="right" width="min(560px, 92vw)" title={`Chỉnh sửa: ${title}`} onClose={() => setOpen(false)}>
        <PageContentEditor page={page} content={content} />
      </Drawer>
    </>
  );
}
