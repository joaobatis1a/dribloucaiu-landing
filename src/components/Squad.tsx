import { motion } from "framer-motion";
import { squad } from "@/data/team";
import { PlayerCard } from "@/components/PlayerCard";
import { SectionTitle } from "@/components/SectionTitle";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Squad() {
  return (
    <section id="elenco" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionTitle kicker="Squad" title="Elenco" />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        style={{ perspective: 1200 }}
      >
        {squad.map((player) => (
          <motion.div key={player.name} variants={item}>
            <PlayerCard player={player} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
