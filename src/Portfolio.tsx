import { useOutletContext } from "react-router";
import { Separator } from "@/components/ui/separator";
import About from "@/components/About";
import Certs from "@/components/Certs";
import Hero from "@/components/Hero";
import Playground from "@/components/Playground";
import Skills from "@/components/Skills";
import { HOME_TITLE, usePageTitle } from "@/hooks/use-page-title";
import type { LayoutContext } from "@/Layout";

export default function Portfolio() {
  const { visits, played, markPlayed } = useOutletContext<LayoutContext>();
  usePageTitle(HOME_TITLE);

  return (
    <>
      <Hero visits={visits} played={played} />
      <About />
      <Separator />
      <Playground markPlayed={markPlayed} />
      <Skills />
      <Certs />
    </>
  );
}
