import { SOURCE_URL } from "@/data";

export default function Footer() {
  return (
    <footer className="page">
      <p className="m-0 border-t border-rule py-8 font-mono text-xs text-muted">
        © {new Date().getFullYear()} Sahil Kolge ·{" "}
        <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="link">
          Source on GitHub
        </a>
      </p>
    </footer>
  );
}
