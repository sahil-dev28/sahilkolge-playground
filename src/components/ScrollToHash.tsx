import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

// Handles scrolling when the route changes. Hash-only changes on the same page
// are left to the browser and the existing nav code.
export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  const seen = useRef<string | null>(null);
  const positions = useRef(new Map<string, number>());

  // Remember where each history entry was scrolled to, so Back/Forward can return there.
  useEffect(() => {
    const save = () => positions.current.set(key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [key]);

  useEffect(() => {
    if (seen.current === pathname) return;
    const first = seen.current === null;
    // Mark as seen inside the frame so StrictMode's double effect still scrolls.
    const raf = requestAnimationFrame(() => {
      seen.current = pathname;
      const saved = navType === "POP" ? positions.current.get(key) : undefined;
      if (saved !== undefined) {
        window.scrollTo(0, saved);
        return;
      }
      if (!hash) {
        if (!first) window.scrollTo(0, 0);
        return;
      }
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return;
      el.scrollIntoView();
      el.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash, key, navType]);

  return null;
}
