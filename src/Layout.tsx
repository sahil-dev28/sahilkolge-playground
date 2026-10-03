import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Contact from "@/components/Contact";
import Nav from "@/components/Nav";
import ScrollToHash from "@/components/ScrollToHash";
import { PROJECTS, type Played, type ProjectId } from "@/data";
import { useTheme } from "@/hooks/use-theme";
import { storage } from "@/lib/storage";

export interface LayoutContext {
  visits: number;
  played: Played;
  markPlayed: (id: ProjectId) => () => void;
}

export default function Layout() {
  const { dark, toggleMode } = useTheme();
  const [visits, setVisits] = useState(1);
  const [played, setPlayed] = useState<Played>({});

  useEffect(() => {
    const n = (parseInt(storage.get("sk-visits") ?? "", 10) || 0) + 1;
    storage.set("sk-visits", String(n));
    setVisits(n);
  }, []);

  const total = PROJECTS.length;
  const playedCount = Object.keys(played).length;
  const markPlayed = (id: ProjectId) => () => setPlayed((p) => (p[id] ? p : { ...p, [id]: true }));
  const context: LayoutContext = { visits, played, markPlayed };

  return (
    <div className="min-h-screen">
      <ScrollToHash />
      <Nav dark={dark} onToggleMode={toggleMode} playedCount={playedCount} total={total} />
      <Outlet context={context} />
      <Contact playedCount={playedCount} total={total} />
    </div>
  );
}
