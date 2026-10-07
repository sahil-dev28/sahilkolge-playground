import { Link, useLocation } from "react-router";
import { RESUME_URL } from "@/data";

interface HeaderProps {
  dark: boolean;
  onToggleMode: () => void;
}

export default function Header({ dark, onToggleMode }: HeaderProps) {
  const { pathname } = useLocation();
  return (
    // Case studies use a wider two-column layout; keep the header aligned with it.
    <header
      className={`page flex items-baseline justify-between gap-4 pt-6 text-[15px] ${pathname.startsWith("/work/") ? "lg:max-w-[1040px]" : ""}`}
    >
      {pathname === "/" ? <span /> : <Link to="/" className="font-semibold">Sahil Kolge</Link>}
      <nav className="flex gap-1.5">
        <Link to="/projects" className="link">
          Projects
        </Link>
        <span className="text-muted" aria-hidden>·</span>
        <a href={RESUME_URL} target="_blank" rel="noreferrer" className="link">
          Resume
        </a>
        <span className="text-muted" aria-hidden>·</span>
        <button
          type="button"
          onClick={onToggleMode}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="link"
        >
          {dark ? "Light" : "Dark"}
        </button>
      </nav>
    </header>
  );
}
