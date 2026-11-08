import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const COLORS = [
  { name: "Vermelho", value: "#d2141c" },
  { name: "Preto", value: "#151311" },
  { name: "Amarelo", value: "#ffd000" },
];

/**
 * Muro pichável: o visitante arrasta (mouse ou dedo) e solta tinta de spray, com escorrido.
 * Nada é salvo; é só pra brincar.
 */
export function SprayWall({ children }: { children?: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(COLORS[0]!.value);
  const [touched, setTouched] = useState(false);

  // Ajusta o canvas ao tamanho do muro (mantendo o que já foi pintado).
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = wrap.getBoundingClientRect();
      const copy = document.createElement("canvas");
      copy.width = canvas.width;
      copy.height = canvas.height;
      if (canvas.width && canvas.height) copy.getContext("2d")?.drawImage(canvas, 0, 0);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx && copy.width) ctx.drawImage(copy, 0, 0, canvas.width, canvas.height);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const spray = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const dpr = canvas.width / canvas.getBoundingClientRect().width;
      const cx = x * dpr;
      const cy = y * dpr;
      const radius = 16 * dpr;
      ctx.fillStyle = color;
      // núcleo denso
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
      ctx.fill();
      // névoa de pontinhos
      ctx.globalAlpha = 0.75;
      for (let i = 0; i < 46; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius;
        const s = (Math.random() * 1.3 + 0.6) * dpr;
        ctx.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r, s, s);
      }
      // escorrido de vez em quando
      if (Math.random() < 0.025) {
        const len = (20 + Math.random() * 60) * dpr;
        const w = (2 + Math.random() * 2) * dpr;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(cx - w / 2, cy, w, len);
        ctx.beginPath();
        ctx.arc(cx, cy + len, w * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    [color],
  );

  const point = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e);
    last.current = p;
    spray(p.x, p.y);
    setTouched(true);
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const p = point(e);
    const prev = last.current ?? p;
    const dist = Math.hypot(p.x - prev.x, p.y - prev.y);
    const steps = Math.max(1, Math.floor(dist / 5));
    for (let i = 1; i <= steps; i++) {
      spray(prev.x + ((p.x - prev.x) * i) / steps, prev.y + ((p.y - prev.y) * i) / steps);
    }
    last.current = p;
  }

  function onUp() {
    drawing.current = false;
    last.current = null;
  }

  function clear() {
    const c = canvasRef.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setTouched(false);
  }

  return (
    <div className="relative">
      <div ref={wrapRef} className="wall relative h-[clamp(240px,38vh,420px)] overflow-hidden">
        {children}
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="absolute inset-0 cursor-crosshair touch-none"
          aria-label="Muro pra pichar: arraste pra pintar"
          role="img"
        />
        <AnimatePresence>
          {!touched ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 10 }}
              className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 bg-[var(--piche)] px-3 py-1.5 font-mono text-xs uppercase text-[var(--cal)]"
            >
              Arraste pra pichar o muro
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="font-mono text-xs uppercase text-[var(--cal)]/60">Tinta</span>
        {COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setColor(c.value)}
            aria-label={c.name}
            aria-pressed={color === c.value}
            className={`h-7 w-7 rounded-full border-2 transition-transform ${
              color === c.value
                ? "scale-125 border-[var(--cal)]"
                : "border-[var(--cal)]/30 hover:scale-110"
            }`}
            style={{ background: c.value }}
          />
        ))}
        <button
          type="button"
          onClick={clear}
          className="ml-auto font-mono text-xs uppercase text-[var(--cal)]/70 underline underline-offset-4 hover:text-[var(--cartao)]"
        >
          Limpar o muro
        </button>
      </div>
    </div>
  );
}
