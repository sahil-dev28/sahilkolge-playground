import { CARE } from "../data.js";

export default function Care() {
  return (
    <section className="care">
      <div className="wrap care-inner">
        <h2 className="display section-title">
          Four things I <span className="serif-i">keep caring about</span>
        </h2>
        <div className="care-grid">
          {CARE.map(([title, text], i) => (
            <div key={title}>
              <span className="mono">0{i + 1}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
