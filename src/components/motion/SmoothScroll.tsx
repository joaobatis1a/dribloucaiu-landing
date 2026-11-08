import { useEffect } from "react";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Instância global do Lenis (null com movimento reduzido ou antes de montar). */
export const getLenis = () => lenis;

/** Rola até um alvo usando o Lenis quando ativo, senão a rolagem nativa. */
export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "string" ? -72 : 0, duration: 1.2 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}

/** Rolagem suave com inércia na página inteira; desligada para quem prefere menos movimento. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: -72 } });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
