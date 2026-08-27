import { motion } from "framer-motion";
import { squad } from "@/data/team";
import { PlayerCard } from "@/components/PlayerCard";
import { SectionTitle } from "@/components/SectionTitle";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Squad() {
  return (
    <section id="elenco" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionTitle kicker="Squad" title="Elenco" />
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
        Quem veste a camisa do Driblou Caiu.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {squad.map((player, i) => (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
          >
            <PlayerCard player={player} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
