import { useEffect, useState } from "react";
import "./portfolio.css";
import { PROJECTS } from "./data.js";
import { initialMode, storage } from "./lib/storage.js";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Playground from "./components/Playground.jsx";
import Care from "./components/Care.jsx";
import Skills from "./components/Skills.jsx";
import Certs from "./components/Certs.jsx";
import Contact from "./components/Contact.jsx";

export default function Portfolio() {
  const [mode, setMode] = useState(initialMode);
  const [visits, setVisits] = useState(1);
  const [played, setPlayed] = useState({});

  useEffect(() => {
    const n = (parseInt(storage.get("sk-visits"), 10) || 0) + 1;
    storage.set("sk-visits", String(n));
    setVisits(n);
  }, []);

  const dark = mode === "dark";
  const total = PROJECTS.length;
  const playedCount = Object.keys(played).length;
  const markPlayed = (id) => () => setPlayed((p) => (p[id] ? p : { ...p, [id]: true }));

  const toggleMode = () => {
    const next = dark ? "light" : "dark";
    storage.set("sk-mode", next);
    setMode(next);
  };

  return (
    <div className="app" data-mode={mode}>
      <Nav dark={dark} onToggleMode={toggleMode} playedCount={playedCount} total={total} />
      <Hero visits={visits} played={played} />
      <div className="divider" />
      <Playground markPlayed={markPlayed} />
      <Care />
      <Skills />
      <Certs />
      <Contact playedCount={playedCount} total={total} mode={mode} />
    </div>
  );
}
