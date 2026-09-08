import { Card } from "@vn-dylan/ui";

export function TargetGrid({
  eyebrow,
  title,
  desc,
  items
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  items: string[][];
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          {desc && <p>{desc}</p>}
        </div>
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
