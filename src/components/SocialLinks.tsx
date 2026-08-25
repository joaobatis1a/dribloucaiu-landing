import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
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
    accent: "var(--accent)",
    cta: "Seguir no TikTok",
  },
  {
    name: "Instagram",
    handle: club.social.instagram.handle,
    url: club.social.instagram.url,
    description: "Fotos oficiais, escalação dos jogos e anúncios do clube em primeira mão.",
    Icon: Instagram,
    accent: "var(--primary)",
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
            whileHover={{ y: -3 }}
            className="group relative isolate flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.9)] transition-colors duration-300 hover:border-border/80"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-50 transition-transform duration-300 group-hover:scale-x-100"
              style={{ background: p.accent }}
            />
            <div className="grain pointer-events-none absolute inset-0 opacity-[0.035]" aria-hidden />

            <div className="relative flex items-center justify-between">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full border text-foreground transition-colors"
                style={{ borderColor: `color-mix(in oklab, ${p.accent} 45%, var(--border))` }}
              >
                <p.Icon className="h-5 w-5" style={{ color: p.accent }} />
              </span>
              <span className="font-display text-xs uppercase tracking-[0.35em] text-muted-foreground">
                {p.name}
              </span>
            </div>

            <div className="relative mt-10">
              <p className="font-display text-4xl uppercase leading-none tracking-tight text-foreground sm:text-5xl">
                {p.handle}
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
            </div>

            <span className="relative mt-8 inline-flex items-center gap-2 font-display text-sm uppercase tracking-wider text-foreground">
              {p.cta}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
