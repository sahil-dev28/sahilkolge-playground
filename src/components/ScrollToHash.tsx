import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

// Handles scrolling when the route changes. Hash-only changes on the same page
// are left to the browser and the existing nav code.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();
  const seen = useRef<string | null>(null);

  useEffect(() => {
    if (seen.current === pathname) return;
    const first = seen.current === null;
    // Mark as seen inside the frame so StrictMode's double effect still scrolls.
    const raf = requestAnimationFrame(() => {
      seen.current = pathname;
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
  }, [pathname, hash]);

  return null;
}
