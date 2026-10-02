import { CERTS } from "../data.js";

export default function Certs() {
  return (
    <section id="certs" className="wrap certs">
      <h2 className="display section-title">
        Certified, <span className="serif-i">and still learning</span>
      </h2>
      <div className="cert-grid">
        {CERTS.map((c) => (
          <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className="card cert">
            <span className="mono">certificate ↗</span>
            <strong>{c.name}</strong>
          </a>
        ))}
      </div>
    </section>
  );
}
