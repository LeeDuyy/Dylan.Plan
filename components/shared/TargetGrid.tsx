import { Card, Col, Row } from "antd";

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
        <Row className="targets" gutter={[16, 16]}>
          {items.map(([value, label]) => (
            <Col key={`${value}-${label}`} xs={24} sm={12} lg={8} xl={6}>
              <Card className="target-card">
                <strong>{value}</strong>
                <span>{label}</span>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
