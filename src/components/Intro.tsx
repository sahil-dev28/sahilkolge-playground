import { Link } from "react-router";
import profileImg from "@/assets/profile.webp";
import LinkRow from "@/components/LinkRow";
import { BIO, CONTACT, RESUME_URL, TAGLINE } from "@/data";

export default function Intro() {
  return (
    <section id="about" tabIndex={-1} className="flex scroll-mt-6 flex-col gap-4 outline-none">
      <div className="flex items-center gap-4">
        <img
          src={profileImg}
          alt="Sahil Kolge"
          width={64}
          height={64}
          className="size-14 shrink-0 rounded-full object-cover min-[480px]:size-16"
        />
        <div className="min-w-0">
          <h1 className="m-0 text-[22px] leading-[1.2] font-semibold min-[480px]:text-2xl">Sahil Kolge</h1>
          <p className="m-0 text-muted">{TAGLINE}</p>
        </div>
      </div>
      <p className="m-0">{BIO}</p>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <LinkRow
          links={[
            { label: "GitHub", href: CONTACT.github, external: true },
            { label: "LinkedIn", href: CONTACT.linkedin, external: true },
            { label: "Email", href: `mailto:${CONTACT.email}` },
            { label: "Resume", href: RESUME_URL, external: true },
          ]}
        />
        <Link to="/agent" className="text-[15px] text-muted hover:text-text">
          View as agent <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
