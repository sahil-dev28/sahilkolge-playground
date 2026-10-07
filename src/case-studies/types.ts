import type { ProjectId } from "../data.ts";

export type Placement = "hero" | "middle" | "end";

export interface Screen {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  // Where the figure sits: under the header, after architecture, or after hard problems.
  placement: Placement;
}

export interface CaseStudy {
  slug: string;
  // Title, year, tagline, stack and links come from this PROJECTS entry.
  projectId: ProjectId;
  tags: string[];
  meta: { label: string; value: string }[];
  problem: string;
  approach: string;
  architecture: { label: string; items: string[] }[];
  hardProblems: { title: string; problem: string; fix: string }[];
  screens: Screen[];
  outcome: string;
}
