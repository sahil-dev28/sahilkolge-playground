import { CONTACT } from "../data.js";
import { MoonIcon, SunIcon } from "./icons.jsx";

export default function Nav({ dark, onToggleMode, playedCount, total }) {
  return (
    <header className="nav">
      <nav className="wrap nav-inner">
        <a href="#top" className="logo">
          sahil kolge<span>.</span>
        </a>
        <div className="nav-links">
          <a href="#work">Playground</a>
          <a href="#skills">Skills</a>
          <a href="#certs">Certifications</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-tools">
          <button
            type="button"
            className="mode-toggle"
            onClick={onToggleMode}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="mode-knob">{dark ? <MoonIcon /> : <SunIcon />}</span>
          </button>
          <span className="pill-dark mono">
            played {playedCount}/{total}
          </span>
          <a href={`mailto:${CONTACT.email}`} className="btn-accent">
            Hire me
          </a>
        </div>
      </nav>
    </header>
  );
}
