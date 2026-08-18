import { motion } from "framer-motion";
import { Instagram, Play } from "lucide-react";
import { club } from "@/data/team";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { SectionTitle } from "@/components/SectionTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

const platforms = [
  {
    name: "TikTok",
    handle: club.social.tiktok.handle,
    url: club.social.tiktok.url,
    description: "Golaços, bastidores de treino e os melhores momentos dos jogos em vídeo curto.",
    Icon: TikTokIcon,
    gradient: "linear-gradient(135deg, #25F4EE, #000000 45%, #FE2C55)",
    cta: "Seguir no TikTok",
  },
  {
    name: "Instagram",
    handle: club.social.instagram.handle,
    url: club.social.instagram.url,
    description: "Fotos oficiais, escalação dos jogos e anúncios do clube em primeira mão.",
    Icon: Instagram,
    gradient: "linear-gradient(135deg, #FEDA75, #FA7E1E, #D62976, #962FBF, #4F5BD5)",
    cta: "Seguir no Instagram",
  },
];

export function SocialLinks() {
  return (
    <section id="redes" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionTitle kicker="Nas redes" title="Bora seguir" />
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
        Acompanha o Driblou Caiu fora de campo também: conteúdo novo toda semana.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {platforms.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer noopener"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08] transition-opacity duration-300 group-hover:opacity-[0.16]"
              style={{ background: p.gradient }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ boxShadow: `0 0 0 1px color-mix(in oklab, white 25%, transparent)` }}
            />

            <div className="relative flex items-start justify-between">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ background: p.gradient }}
              >
                <p.Icon className="h-7 w-7" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-accent group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <Play className="h-3.5 w-3.5 -rotate-45 fill-current" />
              </span>
            </div>

            <h3 className="relative mt-6 font-display text-2xl uppercase tracking-wide text-foreground">
              {p.name}
            </h3>
            <p className="relative text-sm font-semibold text-accent">{p.handle}</p>
            <p className="relative mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {p.description}
            </p>

            <span className="relative mt-6 inline-flex items-center gap-2 font-display text-sm uppercase tracking-wider text-foreground">
              {p.cta}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
