import { useEffect, useState } from "react";
import { PROJECTS, type Played, type ProjectId } from "@/data";
import { useTheme } from "@/hooks/use-theme";
import { storage } from "@/lib/storage";
import { Separator } from "@/components/ui/separator";
import Care from "@/components/Care";
import Certs from "@/components/Certs";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Playground from "@/components/Playground";
import Skills from "@/components/Skills";

export default function Portfolio() {
  const { mode, dark, toggleMode } = useTheme();
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

  return (
    <div className="min-h-screen">
      <Nav dark={dark} onToggleMode={toggleMode} playedCount={playedCount} total={total} />
      <Hero visits={visits} played={played} />
      <Separator />
      <Playground markPlayed={markPlayed} />
      <Care />
      <Skills />
      <Certs />
      <Contact playedCount={playedCount} total={total} mode={mode} />
    </div>
  );
}
