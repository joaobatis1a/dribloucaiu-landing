import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { TeamStats } from "@/components/TeamStats";
import { Squad } from "@/components/Squad";
import { Results } from "@/components/Results";
import { LeagueTable } from "@/components/LeagueTable";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Driblou Caiu — Time de Pro Clubs no EA FC 26" },
      {
        name: "description",
        content:
          "Elenco, estatísticas, resultados e tabela do Driblou Caiu, clube de Pro Clubs do EA FC 26 em amistosos e liga.",
      },
      { property: "og:title", content: "Driblou Caiu — Pro Clubs EA FC 26" },
      {
        property: "og:description",
        content: "Conheça o elenco, os números e os resultados do Driblou Caiu no EA FC 26.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <Hero />
      <TeamStats />
      <Squad />
      <Results />
      <LeagueTable />
      <SiteFooter />
    </main>
  );
}
