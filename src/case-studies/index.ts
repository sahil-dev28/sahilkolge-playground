import type { CaseStudy } from "./types.ts";
import { worksphere } from "./worksphere.ts";

export const CASE_STUDIES: CaseStudy[] = [worksphere];

export function getCaseStudy(slug: string | undefined): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
