import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Faixa de texto que corre sozinha e acelera (e inclina) conforme a velocidade da rolagem.
 * `direction` 1 = pra esquerda, -1 = pra direita.
 */
export function VelocityMarquee({
  children,
  baseVelocity = 3,
  className = "",
}: {
  children: ReactNode;
  baseVelocity?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skew = useTransform(smoothVelocity, [-2000, 2000], [8, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -Math.sign(baseVelocity) || -1;
    else if (vf > 0) directionFactor.current = Math.sign(baseVelocity) || 1;
    moveBy += directionFactor.current * Math.abs(moveBy) * Math.abs(vf);
    baseX.set(baseX.get() - Math.abs(moveBy) * directionFactor.current);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <motion.div className="flex w-max" style={{ x, skewX: reduce ? 0 : skew }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex shrink-0 items-center">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
