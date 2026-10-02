export default function ProjectSection({ id, meta, title, lead, bullets, liveUrl, children }) {
  return (
    <section id={id} className="project reveal">
      <div className="project-info">
        <div className="project-meta mono">{meta}</div>
        <h2 className="display">{title}</h2>
        <p className="lead">{lead}</p>
        <ul>
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <a className="live" href={liveUrl} target="_blank" rel="noreferrer">
          Open live app ↗
        </a>
      </div>
      {children}
    </section>
  );
}
