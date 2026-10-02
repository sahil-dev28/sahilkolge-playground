import { CONTACT } from "../data.js";

export default function Contact({ playedCount, total, mode }) {
  return (
    <section id="contact" className="contact">
      <div className="wrap contact-inner">
        <span className="mono">
          you played {playedCount} of {total} demos
        </span>
        <h2 className="display">
          Liked playing? <span className="serif-i">Imagine what I'd build for your team.</span>
        </h2>
        <div className="contact-links">
          <a className="primary" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </div>
        <footer>
          <span>© {new Date().getFullYear()} Sahil Mohan Kolge</span>
          <span>{mode} mode · your pick is saved for next time.</span>
        </footer>
      </div>
    </section>
  );
}
