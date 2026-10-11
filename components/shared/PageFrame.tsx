"use client";

import { PageHeader, Stack } from "@vn-dylan/ui";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { currentMeta } from "@/components/shared/nav";

// Khung chung của mọi trang trong app: `PageHeader` (tiêu đề + mô tả lấy từ cây nav,
// hành động của trang ở góc phải) và nội dung xếp theo nhịp `group` của design system.
export function PageFrame({
  eyebrow,
  title,
  description,
  actions,
  children
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const meta = currentMeta(usePathname() ?? "/");

  return (
    <Stack gap="loose" className="page-frame">
      <PageHeader
        breadcrumb={eyebrow != null ? <span className="eyebrow">{eyebrow}</span> : undefined}
        title={title ?? meta.title}
        description={description ?? meta.desc}
        actions={actions}
      />
      <Stack gap="group">{children}</Stack>
    </Stack>
  );
}
