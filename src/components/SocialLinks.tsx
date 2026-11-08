import { Instagram } from "lucide-react";
import { club } from "@/data/team";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { SectionTitle } from "@/components/SectionTitle";

const platforms = [
  {
    name: "Instagram",
    handle: club.social.instagram.handle,
    url: club.social.instagram.url,
    description: "Escalação, resultado e convocação antes de todo mundo.",
    Icon: Instagram,
  },
  {
    name: "TikTok",
    handle: club.social.tiktok.handle,
    url: club.social.tiktok.url,
    description: "Golaço, lance bizarro e resenha do pós-jogo.",
    Icon: TikTokIcon,
  },
];

export function SocialLinks() {
  return (
    <section id="redes" className="bg-[var(--piche)] text-[var(--cal)]">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-28">
        <SectionTitle kicker="Segue lá" title="Redes" invert />
        <ul className="mt-6">
          {platforms.map((p) => (
            <li key={p.name} className="border-b-2 border-[var(--cal)]/25">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group grid gap-x-6 gap-y-1 py-7 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="inline-flex items-center gap-2 font-mono text-sm uppercase text-[var(--cal)]/70">
                  <p.Icon className="h-4 w-4" />
                  {p.name}
                </span>
                <span>
                  <span className="block break-all font-stencil text-[clamp(2.4rem,7vw,5.5rem)] font-black leading-[0.9] transition-colors group-hover:text-[var(--cartao)]">
                    {p.handle}
                  </span>
                  <span className="mt-1 block text-base text-[var(--cal)]/70">{p.description}</span>
                </span>
                <span
                  aria-hidden
                  className="hidden font-display text-5xl font-black transition-transform group-hover:translate-x-2 sm:block"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
