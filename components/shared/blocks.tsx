"use client";

import { Card, EmptyState, IconFrame, Inline, Stack, StatisticCard } from "@vn-dylan/ui";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

// Các khối dựng trang dùng chung, ghép từ primitive của design system để mọi trang
// cùng một nhịp: Panel (thẻ nội dung có tiêu đề), SectionHeading (đầu một nhóm nội
// dung trong trang) và StatCard (thẻ số liệu).

export function SectionHeading({ eyebrow, title, desc }: { eyebrow?: ReactNode; title?: ReactNode; desc?: ReactNode }) {
  return (
    <Stack gap="tight" className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && <h2>{title}</h2>}
      {desc && <p className="muted">{desc}</p>}
    </Stack>
  );
}

export function Panel({
  eyebrow,
  title,
  extra,
  className,
  children
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  extra?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const hasHead = eyebrow != null || title != null || extra != null;
  return (
    <Card className={className ? `panel ${className}` : "panel"}>
      <Stack gap="base">
        {hasHead && (
          <Inline justify="between" align="start" gap="base">
            <Stack gap="tight" className="panel-heading">
              {eyebrow != null && <span className="eyebrow">{eyebrow}</span>}
              {title != null && <h3>{title}</h3>}
            </Stack>
            {extra}
          </Inline>
        )}
        {children}
      </Stack>
    </Card>
  );
}

export type StatTone = "positive" | "negative";

export function StatCard({
  label,
  value,
  hint,
  tone,
  action,
  className,
  children
}: {
  label?: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: StatTone;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <StatisticCard className={className ? `stat-card ${className}` : "stat-card"} data-tone={tone}>
      <Stack gap="tight">
        {(label != null || action != null) && (
          <Inline justify="between" align="center" gap="tight">
            <span className="eyebrow">{label}</span>
            {action}
          </Inline>
        )}
        <strong className="stat-card-value">{value}</strong>
        {children}
        {hint != null && <span className="stat-card-hint">{hint}</span>}
      </Stack>
    </StatisticCard>
  );
}

// Trạng thái rỗng dùng chung (EmptyState của design system): minh hoạ nhỏ + một dòng giải
// thích. `size` là cạnh khung minh hoạ — giữ nhỏ để không chiếm chỗ trong thẻ / bảng.
export function EmptyHint({ children, size = 120 }: { children: ReactNode; size?: number }) {
  return (
    <EmptyState
      size={size}
      variant="dots"
      illustration={
        <IconFrame>
          <Inbox size={20} aria-hidden />
        </IconFrame>
      }
    >
      {children}
    </EmptyState>
  );
}
