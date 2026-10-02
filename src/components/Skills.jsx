import { SKILLS } from "../data.js";

export default function Skills() {
  return (
    <section id="skills" className="wrap skills">
      <h2 className="display section-title">Toolbox</h2>
      <div className="skill-groups">
        {SKILLS.map((g) => (
          <div key={g.k} className="skill-group">
            <span className="mono">{g.k}</span>
            <div className="tags">
              {g.v.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
