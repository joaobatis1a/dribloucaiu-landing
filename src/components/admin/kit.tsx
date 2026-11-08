import type { ReactNode } from "react";
import type { adminSave } from "@/lib/site.functions";

export type Action = Parameters<typeof adminSave>[0]["data"];
export type Save = (action: Action, success: string) => Promise<boolean>;

export const input =
  "w-full border-2 border-[var(--piche)] bg-[var(--papel)] px-3 py-2.5 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/60 focus:border-[var(--tinta)] focus:shadow-[3px_3px_0_var(--tinta)]";
const btn =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 font-display text-lg font-black uppercase leading-none transition-[transform,box-shadow,background-color,color] duration-200 disabled:pointer-events-none disabled:opacity-40";
export const btnPrimary = `${btn} bg-[var(--tinta)] text-white shadow-[4px_4px_0_var(--piche)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--piche)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_var(--piche)]`;
export const btnGhost = `${btn} border-2 border-[var(--piche)] text-foreground hover:bg-[var(--piche)] hover:text-[var(--cal)]`;
export const panel =
  "border-2 border-[var(--piche)] bg-[var(--papel)] p-5 shadow-[5px_5px_0_var(--piche)] sm:p-6";

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block font-mono text-xs font-bold uppercase text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export function PageHeader({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-8 border-b-[3px] border-[var(--piche)] pb-3">
      <h1 className="font-stencil text-[clamp(2.6rem,6vw,4.5rem)] font-black uppercase leading-[0.85]">
        {title}
      </h1>
      {note ? <p className="mt-2 max-w-2xl text-base text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export const num = (v: string) => (v === "" ? 0 : Number(v));
export const uid = () => Math.random().toString(36).slice(2, 10);
export const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || uid();

export function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Algo deu errado. Tente de novo.";
}
