import type { ComponentType } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { ALL_PROJECTS } from "@/all-projects";
import ProjectSection from "@/components/ProjectSection";
import { buttonVariants } from "@/components/ui/button";
import { PROJECTS, type ProjectId } from "@/data";
import AxiosDemo from "@/demos/AxiosDemo";
import HnDemo from "@/demos/HnDemo";
import OrgDemo from "@/demos/OrgDemo";
import PaginationDemo from "@/demos/PaginationDemo";
import type { DemoProps } from "@/demos/types";
import UrbanDemo from "@/demos/UrbanDemo";
import { cn } from "@/lib/utils";

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
    <main id="work" tabIndex={-1} className="wrap flex scroll-mt-20 outline-none flex-col gap-10 py-10">
      {PROJECTS.map(({ id, meta, title, lead, bullets, liveUrl, repoUrl }) => {
        const Demo = DEMOS[id];
        return (
          <ProjectSection
            key={id}
            id={id}
            meta={meta}
            title={title}
            lead={lead}
            bullets={bullets}
            liveUrl={liveUrl}
            repoUrl={repoUrl}
          >
            <Demo onPlay={markPlayed(id)} />
          </ProjectSection>
        );
      })}
      <Link
        to="/projects"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-12 self-center rounded-full border-line-2 bg-card px-6 text-base font-semibold dark:border-line-2 dark:bg-card dark:hover:bg-muted"
        )}
      >
        See all {ALL_PROJECTS.length} projects <ArrowRight aria-hidden />
      </Link>
    </main>
  );
}
