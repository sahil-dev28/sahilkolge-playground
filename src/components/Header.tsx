import { Link, useLocation } from "react-router";
import { RESUME_URL } from "@/data";

interface HeaderProps {
  dark: boolean;
  onToggleMode: () => void;
}

export default function Header({ dark, onToggleMode }: HeaderProps) {
  const { pathname } = useLocation();
  return (
    <header className="page flex items-baseline justify-between gap-4 pt-6 text-[15px]">
      {pathname === "/" ? <span /> : <Link to="/" className="font-semibold">Sahil Kolge</Link>}
      <nav className="flex gap-4">
        <Link to="/projects" className="link">
          Projects
        </Link>
        <a href={RESUME_URL} target="_blank" rel="noreferrer" className="link">
          Resume
        </a>
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
