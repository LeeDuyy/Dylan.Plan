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
            <article className="card target-card" key={`${value}-${label}`}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
