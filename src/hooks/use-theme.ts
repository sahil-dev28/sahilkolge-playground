import { useEffect, useState } from "react";
import { storage, type Mode } from "@/lib/storage";

export function useTheme() {
  // Built HTML is always rendered light, so start light to match it. The inline
  // script in index.html has already set the real class on <html> before paint.
  const [mode, setMode] = useState<Mode>("light");
  const dark = mode === "dark";

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) setMode("dark");
  }, []);

  const toggleMode = () => {
    const next: Mode = dark ? "light" : "dark";
    storage.set("sk-mode", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setMode(next);
  };

  return { mode, dark, toggleMode };
}
