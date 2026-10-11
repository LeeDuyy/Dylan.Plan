"use client";

import { Grid, Stack } from "@vn-dylan/ui";

import { SectionHeading, StatCard } from "@/components/shared/blocks";

// Lưới thẻ chỉ tiêu [giá trị, mô tả] — dùng cho KPI, tuần đầu, scorecard, rủi ro...
// Tiêu đề nhóm chỉ hiện khi có eyebrow/title/desc.
export function TargetGrid({
  eyebrow,
  title,
  desc,
  items
}: {
  eyebrow?: string;
  title?: string;
  desc?: string;
  items: string[][];
}) {
  const grid = (
    <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap="loose">
      {items.map(([value, label]) => (
        <StatCard key={`${value}-${label}`} label={null} value={value} hint={label} className="target-card" />
      ))}
    </Grid>
  );

  if (!eyebrow && !title && !desc) return grid;

  return (
    <Stack gap="base">
      <SectionHeading eyebrow={eyebrow} title={title} desc={desc} />
      {grid}
    </Stack>
  );
}
