import type { ComponentProps } from "react";
import { Link, useLocation } from "react-router";

type SectionLinkProps = Omit<ComponentProps<"a">, "href"> & { id: string };

// Plain anchor on the home page (keeps native jump behaviour); router link elsewhere.
export default function SectionLink({ id, ...rest }: SectionLinkProps) {
  const { pathname } = useLocation();
  return pathname === "/" ? <a href={`#${id}`} {...rest} /> : <Link to={`/#${id}`} {...rest} />;
}
