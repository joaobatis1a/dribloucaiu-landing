import { motion } from "framer-motion";

export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex items-end gap-4">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent"
        >
          {kicker}
        </motion.p>
        <h2 className="mt-2 font-display text-4xl uppercase tracking-tight text-foreground md:text-6xl">
          {title}
        </h2>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-3 h-px flex-1 origin-left bg-gradient-to-r from-primary to-transparent"
      />
    </div>
  );
}
