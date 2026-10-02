import { PROJECTS } from "../data.js";

export default function Hero({ visits, played }) {
  const greeting =
    visits > 1
      ? `welcome back · visit #${visits} · open to frontend roles`
      : "open to frontend roles · new here? start with 01";

  return (
    <section id="top" className="wrap hero">
      <div className="hero-status mono rise r1">
        <span className="live-dot" />
        <span>{greeting}</span>
      </div>
      <h1 className="display rise r2">
        Don't read about my projects. <span className="serif-i">Play with them.</span>
      </h1>
      <div className="hero-row rise r3">
        <p>
          I'm <strong>Sahil Kolge</strong>, a frontend developer who builds scalable React and Next.js apps, and the
          Node APIs under them. Every project below has a small live demo of the{" "}
          <span className="hl">hardest problem I solved in it</span>.
        </p>
        <div className="index">
          {PROJECTS.map((p, i) => (
            <a key={p.id} href={`#${p.id}`} className={`chip ${played[p.id] ? "done" : ""}`}>
              0{i + 1} {p.short}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
