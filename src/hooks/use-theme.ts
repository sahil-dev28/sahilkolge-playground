import { useEffect, useState } from "react";
import { initialMode, storage, type Mode } from "@/lib/storage";

export function useTheme() {
  const [mode, setMode] = useState<Mode>(initialMode);
  const dark = mode === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleMode = () => {
    const next: Mode = dark ? "light" : "dark";
    storage.set("sk-mode", next);
    setMode(next);
  };

  return { mode, dark, toggleMode };
}
