import { PROJECTS } from "../data.js";
import ProjectSection from "./ProjectSection.jsx";
import OrgDemo from "../demos/OrgDemo.jsx";
import PaginationDemo from "../demos/PaginationDemo.jsx";
import HnDemo from "../demos/HnDemo.jsx";
import UrbanDemo from "../demos/UrbanDemo.jsx";
import AxiosDemo from "../demos/AxiosDemo.jsx";

const DEMOS = {
  p1: OrgDemo,
  p2: PaginationDemo,
  p3: HnDemo,
  p4: UrbanDemo,
  p5: AxiosDemo,
};

export default function Playground({ markPlayed }) {
  return (
    <main id="work" className="wrap playground">
      {PROJECTS.map(({ id, meta, title, lead, bullets, liveUrl }) => {
        const Demo = DEMOS[id];
        return (
          <ProjectSection key={id} id={id} meta={meta} title={title} lead={lead} bullets={bullets} liveUrl={liveUrl}>
            <Demo onPlay={markPlayed(id)} />
          </ProjectSection>
        );
      })}
    </main>
  );
}
