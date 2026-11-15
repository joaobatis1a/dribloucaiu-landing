import { motion, useReducedMotion } from "framer-motion";
import { useSite } from "@/components/site-context";
import { Block, Empty } from "@/components/stats/ui";
import { EASE_OUT } from "@/components/motion/Reveal";
import { byMonth, chronological, evolution, shortName } from "@/lib/site-derive";
import { matchOutcome } from "@/lib/match";

const INK = "var(--piche)";
const RED = "var(--tinta)";
const YELLOW = "var(--cartao)";

/** Gols a favor (preto) e contra (vermelho) em cada uma das últimas partidas. */
function GoalsChart() {
  const { site } = useSite();
  const reduce = useReducedMotion();
  const list = chronological(site).slice(-12);
  const max = Math.max(3, ...list.flatMap((m) => [m.goalsFor, m.goalsAgainst]));
  const W = 600;
  const H = 230;
  const pad = { t: 14, r: 8, b: 44, l: 26 };
  const innerH = H - pad.t - pad.b;
  const slot = (W - pad.l - pad.r) / list.length;
  const bar = Math.min(slot * 0.34, 20);
  const y = (n: number) => pad.t + innerH - (n / max) * innerH;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Gols a favor e contra por partida"
    >
      {Array.from({ length: max + 1 }, (_, n) => (
        <g key={n}>
          <line
            x1={pad.l}
            x2={W - pad.r}
            y1={y(n)}
            y2={y(n)}
            stroke={INK}
            strokeOpacity={n === 0 ? 0.9 : 0.12}
            strokeWidth={n === 0 ? 2 : 1}
          />
          {n % (max > 6 ? 2 : 1) === 0 ? (
            <text
              x={pad.l - 6}
              y={y(n) + 3.5}
              textAnchor="end"
              fontSize="10"
              fontFamily="var(--font-mono)"
              fill={INK}
              fillOpacity={0.6}
            >
              {n}
            </text>
          ) : null}
        </g>
      ))}
      {list.map((m, i) => {
        const cx = pad.l + slot * i + slot / 2;
        const o = matchOutcome(m.goalsFor, m.goalsAgainst);
        return (
          <g key={m.id}>
            {[
              { v: m.goalsFor, x: cx - bar - 1, fill: INK },
              { v: m.goalsAgainst, x: cx + 1, fill: RED },
            ].map((b, j) => (
              <motion.rect
                key={j}
                x={b.x}
                width={bar}
                fill={b.fill}
                initial={reduce ? false : { y: y(0), height: 0 }}
                whileInView={{ y: y(b.v), height: y(0) - y(b.v) }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: i * 0.04, ease: EASE_OUT }}
              />
            ))}
            <text
              x={cx - bar / 2 - 1}
              y={y(m.goalsFor) - 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              fill={INK}
            >
              {m.goalsFor || ""}
            </text>
            <text
              x={cx + bar / 2 + 1}
              y={y(m.goalsAgainst) - 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fontFamily="var(--font-mono)"
              fill={RED}
            >
              {m.goalsAgainst || ""}
            </text>
            <rect
              x={cx - 9}
              y={H - 36}
              width="18"
              height="15"
              fill={o === "V" ? INK : o === "E" ? YELLOW : RED}
            />
            <text
              x={cx}
              y={H - 25}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fontFamily="var(--font-display)"
              fill={o === "V" ? "var(--cal)" : o === "E" ? INK : "#fff"}
            >
              {o}
            </text>
            <text
              x={cx}
              y={H - 8}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-mono)"
              fill={INK}
              fillOpacity={0.7}
            >
              {shortName(m.opponent)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Aproveitamento acumulado: como a campanha subiu ou caiu a cada jogo. */
function RateChart() {
  const { site } = useSite();
  const reduce = useReducedMotion();
  const pts = evolution(site);
  const W = 600;
  const H = 190;
  const pad = { t: 14, r: 12, b: 26, l: 34 };
  const x = (i: number) =>
    pad.l + (pts.length === 1 ? 0 : (i / (pts.length - 1)) * (W - pad.l - pad.r));
  const y = (rate: number) => pad.t + (1 - rate / 100) * (H - pad.t - pad.b);
  const line = pts
    .map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.rate).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(pts.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Aproveitamento acumulado ao longo das partidas"
    >
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line
            x1={pad.l}
            x2={W - pad.r}
            y1={y(g)}
            y2={y(g)}
            stroke={INK}
            strokeOpacity={g === 0 ? 0.9 : 0.12}
            strokeWidth={g === 0 ? 2 : 1}
          />
          <text
            x={pad.l - 6}
            y={y(g) + 3.5}
            textAnchor="end"
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill={INK}
            fillOpacity={0.6}
          >
            {g}%
          </text>
        </g>
      ))}
      <motion.path
        d={area}
        fill={YELLOW}
        fillOpacity={0.55}
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease: EASE_OUT }}
      />
      {pts.map((p, i) => (
        <g key={p.match.id}>
          <circle
            cx={x(i)}
            cy={y(p.rate)}
            r={4.5}
            fill={matchOutcome(p.match.goalsFor, p.match.goalsAgainst) === "D" ? RED : INK}
            stroke="var(--papel)"
            strokeWidth={2}
          >
            <title>{`${p.n}º jogo · ${p.match.opponent} ${p.match.goalsFor}×${p.match.goalsAgainst} · ${p.rate}%`}</title>
          </circle>
          {pts.length <= 14 || i % 2 === 0 ? (
            <text
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-mono)"
              fill={INK}
              fillOpacity={0.7}
            >
              {p.n}º
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

/** Colunas empilhadas de V/E/D por mês. */
function MonthChart() {
  const { site } = useSite();
  const reduce = useReducedMotion();
  const months = byMonth(site);
  const max = Math.max(...months.map((m) => m.won + m.drawn + m.lost), 1);

  return (
    <div
      className="flex items-end gap-3 overflow-x-auto pb-1"
      role="img"
      aria-label="Resultados por mês"
    >
      {months.map((m, mi) => (
        <div key={m.key} className="flex w-14 shrink-0 flex-col items-center">
          <div className="flex h-36 w-full flex-col-reverse justify-start border-b-2 border-foreground">
            {[
              { n: m.won, cls: "bg-[var(--piche)] text-[var(--cal)]" },
              { n: m.drawn, cls: "bg-[var(--cartao)] text-[var(--piche)]" },
              { n: m.lost, cls: "bg-[var(--tinta)] text-white" },
            ].map((s, i) =>
              s.n > 0 ? (
                <motion.div
                  key={i}
                  className={`grid place-items-center font-display text-sm font-black ${s.cls}`}
                  initial={reduce ? false : { height: 0 }}
                  whileInView={{ height: `${(s.n / max) * 100}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, delay: mi * 0.06 + i * 0.05, ease: EASE_OUT }}
                >
                  {s.n}
                </motion.div>
              ) : null,
            )}
          </div>
          <span className="mt-1.5 font-mono text-[11px] uppercase text-muted-foreground">
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <i className="inline-block h-2.5 w-2.5 bg-[var(--piche)]" /> A favor / vitória
      </span>
      <span className="inline-flex items-center gap-1.5">
        <i className="inline-block h-2.5 w-2.5 bg-[var(--cartao)]" /> Empate
      </span>
      <span className="inline-flex items-center gap-1.5">
        <i className="inline-block h-2.5 w-2.5 bg-[var(--tinta)]" /> Contra / derrota
      </span>
    </div>
  );
}

/** Como o time evoluiu: gols por partida, aproveitamento acumulado e resultados por mês. */
export function Evolution() {
  const { site } = useSite();
  const n = site.matches.length;

  if (n < 2) {
    return <Empty>Os gráficos aparecem com pelo menos 2 partidas lançadas. Hoje há {n}.</Empty>;
  }

  return (
    <div className="space-y-10">
      <Block title="Gols por partida" hint={`últimas ${Math.min(n, 12)} partidas`}>
        <Legend />
        <GoalsChart />
      </Block>
      <Block title="Aproveitamento acumulado" hint="pontos conquistados ÷ pontos possíveis">
        <RateChart />
      </Block>
      <Block title="Resultados por mês">
        <Legend />
        <MonthChart />
      </Block>
    </div>
  );
}
