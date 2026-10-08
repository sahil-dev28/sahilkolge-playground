import { hackerNews } from "./hacker-news.ts";
import { philkart } from "./philkart.ts";
import type { CaseStudy } from "./types.ts";
import { urbanEstate } from "./urban-estate.ts";
import { worksphere } from "./worksphere.ts";

export const CASE_STUDIES: CaseStudy[] = [worksphere, philkart, urbanEstate, hackerNews];

export function getCaseStudy(slug: string | undefined): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

// The case study after this one, wrapping to the first. None when there is only one.
export function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const i = CASE_STUDIES.findIndex((c) => c.slug === slug);
  if (i === -1 || CASE_STUDIES.length < 2) return undefined;
  return CASE_STUDIES[(i + 1) % CASE_STUDIES.length];
}
