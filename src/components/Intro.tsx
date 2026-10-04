import profileImg from "@/assets/profile.webp";
import LinkRow from "@/components/LinkRow";
import { BIO, CONTACT, RESUME_URL } from "@/data";

export default function Intro() {
  return (
    <section id="about" tabIndex={-1} className="flex scroll-mt-6 flex-col gap-4 outline-none">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h1 className="m-0 text-2xl leading-tight font-semibold min-[480px]:text-[30px]">Sahil Kolge</h1>
          <p className="m-0 text-muted">Full stack developer in Mumbai, open to roles.</p>
        </div>
        <img
          src={profileImg}
          alt="Sahil Kolge"
          width={88}
          height={88}
          className="size-[72px] shrink-0 rounded-full object-cover min-[480px]:size-[88px]"
        />
      </div>
      <p className="m-0">{BIO}</p>
      <LinkRow
        links={[
          { label: "GitHub", href: CONTACT.github, external: true },
          { label: "LinkedIn", href: CONTACT.linkedin, external: true },
          { label: "Email", href: `mailto:${CONTACT.email}` },
          { label: "Resume", href: RESUME_URL, external: true },
        ]}
      />
    </section>
  );
}
