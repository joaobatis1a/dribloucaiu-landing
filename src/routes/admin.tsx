import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClock,
  ExternalLink,
  Goal,
  History,
  Home,
  LayoutGrid,
  ListOrdered,
  LogOut,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import crest from "@/assets/crest.webp";
import { Toaster } from "@/components/ui/sonner";
import { SiteProvider } from "@/components/site-context";
import { adminLogin, adminLogout, adminSave, adminStatus, getSite } from "@/lib/site.functions";
import type { SiteData } from "@/lib/site-schema";
import { PageHeader, errMsg, type Save } from "@/components/admin/kit";
import { Overview, type TabId } from "@/components/admin/Overview";
import { MatchesTab } from "@/components/admin/MatchesTab";
import { NextMatchTab } from "@/components/admin/NextMatchTab";
import { LineupTab } from "@/components/admin/LineupTab";
import { SquadTab } from "@/components/admin/SquadTab";
import { TableTab } from "@/components/admin/TableTab";
import { BaselineTab } from "@/components/admin/BaselineTab";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Vestiário · Driblou Caiu" }, { name: "robots", content: "noindex" }],
  }),
  loader: async () => ({ status: await adminStatus(), site: await getSite() }),
  component: AdminPage,
});

const TABS: Array<{ id: TabId; label: string; title: string; note?: string; Icon: typeof Home }> = [
  {
    id: "visao",
    label: "Vestiário",
    title: "Vestiário",
    note: "Resumo do clube e atalhos pro que mais muda.",
    Icon: Home,
  },
  {
    id: "partidas",
    label: "Partidas",
    title: "Partidas",
    note: "Lance o placar com quem marcou e quem deu passe. Artilharia e números do site atualizam sozinhos.",
    Icon: Goal,
  },
  {
    id: "proximo",
    label: "Próximo jogo",
    title: "Próximo jogo",
    note: "Vira o lambe-lambe com contagem regressiva no site.",
    Icon: CalendarClock,
  },
  {
    id: "escalacao",
    label: "Escalação",
    title: "Escalação",
    note: "Escolha o esquema, arraste os slots e defina camisa e jogador de cada um.",
    Icon: LayoutGrid,
  },
  {
    id: "elenco",
    label: "Elenco",
    title: "Elenco",
    note: "Quem está no time. Fotos, atributos e capitão.",
    Icon: Users,
  },
  {
    id: "tabela",
    label: "Tabela",
    title: "Tabela da liga",
    note: "Editada à mão porque tem jogos de outros clubes. A linha “Driblou Caiu” fica destacada.",
    Icon: ListOrdered,
  },
  {
    id: "historico",
    label: "Histórico",
    title: "Histórico",
    note: "Números de antes do site, somados às partidas lançadas.",
    Icon: History,
  },
];

/* ───────────────────────── Login ───────────────────────── */

function Login({ configured, onDone }: { configured: boolean; onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await adminLogin({ data: { password: pw } });
      if (res.ok) onDone();
      else toast.error(res.error);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wall grid min-h-screen place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative w-full max-w-md"
      >
        <span className="tape absolute -top-3 left-10 z-10 h-7 w-24 -rotate-6" aria-hidden />
        <div className="bg-[var(--piche)] p-8 text-[var(--cal)] shadow-[8px_8px_0_var(--tinta)]">
          <img src={crest} alt="" className="h-20 w-20" />
          <p className="mt-6 font-mono text-sm uppercase text-[var(--cal)]/60">Área restrita</p>
          <h1 className="font-stencil text-6xl font-black uppercase leading-[0.85]">Vestiário</h1>
          {configured ? (
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-1.5 block font-mono text-xs font-bold uppercase text-[var(--cal)]/60">
                  Senha
                </span>
                <input
                  type="password"
                  autoFocus
                  autoComplete="current-password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full border-2 border-[var(--cal)] bg-transparent px-3 py-3 text-lg text-[var(--cal)] outline-none focus:border-[var(--cartao)]"
                />
              </label>
              <button
                disabled={busy || !pw}
                className="w-full bg-[var(--tinta)] px-5 py-3 font-display text-xl font-black uppercase text-white transition-transform hover:-translate-y-0.5 disabled:opacity-40"
              >
                {busy ? "Entrando…" : "Entrar no vestiário"}
              </button>
            </form>
          ) : (
            <p className="mt-8 border-2 border-dashed border-[var(--cal)]/40 p-4 text-sm">
              O painel está desligado porque a variável{" "}
              <code className="text-[var(--cartao)]">ADMIN_PASSWORD</code> não foi definida no
              servidor. Defina nas configurações do projeto e faça um novo deploy.
            </p>
          )}
          <Link
            to="/"
            className="mt-8 inline-block font-mono text-xs uppercase text-[var(--cal)]/60 hover:text-[var(--cartao)]"
          >
            ← Voltar pro site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Painel ───────────────────────── */

function AdminPage() {
  const { status, site: initial } = Route.useLoaderData();
  const router = useRouter();
  const [authed, setAuthed] = useState(status.authed);
  const [site, setSite] = useState<SiteData>(initial);
  const [tab, setTab] = useState<TabId>("visao");
  const current = TABS.find((t) => t.id === tab)!;

  const save: Save = async (action, success) => {
    try {
      setSite(await adminSave({ data: action }));
      toast.success(success);
      return true;
    } catch (e) {
      toast.error(errMsg(e));
      return false;
    }
  };

  function go(t: TabId) {
    setTab(t);
    window.scrollTo({ top: 0 });
  }

  if (!authed) {
    return (
      <>
        <Login
          configured={status.configured}
          onDone={async () => {
            setSite(await getSite());
            setAuthed(true);
          }}
        />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <SiteProvider site={site}>
      <div className="wall min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="sticky top-0 z-30 bg-[var(--piche)] text-[var(--cal)] lg:h-screen">
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:block lg:px-6 lg:py-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={crest} alt="" className="h-11 w-11 lg:h-16 lg:w-16" />
              <span className="font-stencil text-2xl font-black uppercase leading-[0.85] lg:mt-3 lg:block lg:text-3xl">
                Vestiário
              </span>
            </Link>
            <div className="flex items-center gap-4 lg:hidden">
              <Link
                to="/"
                className="text-[var(--cal)]/70 hover:text-[var(--cartao)]"
                aria-label="Ver site"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
              <button
                aria-label="Sair"
                className="text-[var(--cal)]/70 hover:text-[var(--cartao)]"
                onClick={async () => {
                  await adminLogout();
                  setAuthed(false);
                  router.invalidate();
                }}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav
            aria-label="Seções do painel"
            className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0"
          >
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`relative flex shrink-0 items-center gap-3 px-3 py-2 font-display text-lg font-black uppercase transition-colors lg:py-2.5 ${
                  tab === id
                    ? "text-[var(--piche)]"
                    : "text-[var(--cal)]/70 hover:text-[var(--cal)]"
                }`}
              >
                {tab === id ? (
                  <motion.span
                    layoutId="admin-tab"
                    className="absolute inset-0 bg-[var(--cartao)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                ) : null}
                <Icon className="relative h-5 w-5" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute inset-x-0 bottom-0 hidden space-y-1 border-t border-[var(--cal)]/15 p-3 lg:block">
            {status.storage !== "redis" ? (
              <p className="px-3 pb-2 font-mono text-[11px] uppercase text-[var(--cartao)]">
                {status.storage === "file"
                  ? "Dev: salvando em .data/db.json"
                  : "Sem banco: não salva"}
              </p>
            ) : null}
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 font-display text-lg font-black uppercase text-[var(--cal)]/70 hover:text-[var(--cal)]"
            >
              <ExternalLink className="h-5 w-5" /> Ver site
            </Link>
            <button
              className="flex w-full items-center gap-3 px-3 py-2 font-display text-lg font-black uppercase text-[var(--cal)]/70 hover:text-[var(--tinta)]"
              onClick={async () => {
                await adminLogout();
                setAuthed(false);
                router.invalidate();
              }}
            >
              <LogOut className="h-5 w-5" /> Sair
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
          {status.storage === "none" ? (
            <p className="mb-6 border-2 border-[var(--tinta)] bg-[var(--tinta)]/10 p-3 text-sm">
              Nenhum banco de dados conectado: nada vai ser salvo. Conecte o Upstash Redis ao
              projeto na Vercel e faça um novo deploy.
            </p>
          ) : null}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <PageHeader title={current.title} {...(current.note ? { note: current.note } : {})} />
              {tab === "visao" ? <Overview site={site} go={go} /> : null}
              {tab === "partidas" ? <MatchesTab site={site} save={save} /> : null}
              {tab === "proximo" ? <NextMatchTab site={site} save={save} /> : null}
              {tab === "escalacao" ? <LineupTab site={site} save={save} /> : null}
              {tab === "elenco" ? <SquadTab site={site} save={save} /> : null}
              {tab === "tabela" ? <TableTab site={site} save={save} /> : null}
              {tab === "historico" ? <BaselineTab site={site} save={save} /> : null}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster position="top-center" />
    </SiteProvider>
  );
}
