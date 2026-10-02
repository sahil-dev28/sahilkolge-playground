import type { ComponentType } from "react";
import ProjectSection from "@/components/ProjectSection";
import { PROJECTS, type ProjectId } from "@/data";
import AxiosDemo from "@/demos/AxiosDemo";
import HnDemo from "@/demos/HnDemo";
import OrgDemo from "@/demos/OrgDemo";
import PaginationDemo from "@/demos/PaginationDemo";
import type { DemoProps } from "@/demos/types";
import UrbanDemo from "@/demos/UrbanDemo";

const DEMOS: Record<ProjectId, ComponentType<DemoProps>> = {
  p1: OrgDemo,
  p2: PaginationDemo,
  p3: HnDemo,
  p4: UrbanDemo,
  p5: AxiosDemo,
};

interface PlaygroundProps {
  markPlayed: (id: ProjectId) => () => void;
}

export default function Playground({ markPlayed }: PlaygroundProps) {
  return (
    <main id="work" className="wrap flex flex-col gap-10 py-10">
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
