import { Card } from "@vn-dylan/ui";

export function TargetGrid({
  eyebrow,
  title,
  desc,
  items,
  headless = false
}: {
  eyebrow?: string;
  title?: string;
  desc?: string;
  items: string[][];
  // `headless`: bỏ phần tiêu đề section (dùng khi header cố định đã hiển thị tiêu đề).
  headless?: boolean;
}) {
  return (
    <section className="section">
      <div className="container">
        {!headless && (
          <div className="section-head">
            <div>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {title && <h2>{title}</h2>}
            </div>
            {desc && <p>{desc}</p>}
          </div>
        )}
        <div className="targets">
          {items.map(([value, label]) => (
            <Card key={`${value}-${label}`} className="target-card">
              <strong>{value}</strong>
              <span>{label}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
