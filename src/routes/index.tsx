import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TeamStats } from "@/components/TeamStats";
import { About } from "@/components/About";
import { Formation } from "@/components/Formation";
import { Squad } from "@/components/Squad";
import { NextMatch } from "@/components/NextMatch";
import { MatchCenter } from "@/components/MatchCenter";
import { SiteProvider } from "@/components/site-context";
import { getSite } from "@/lib/site.functions";
import { SocialLinks } from "@/components/SocialLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollToTop } from "@/components/ScrollToTop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Driblou Caiu FC" },
      {
        name: "description",
        content:
          "Elenco, esquema tático e amistosos do Driblou Caiu, clube de Pro Clubs do EA FC 26.",
      },
      { property: "og:title", content: "Driblou Caiu FC" },
      {
        property: "og:description",
        content: "Conheça o elenco, o esquema tático, os números e os resultados do Driblou Caiu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getSite(),
  component: Index,
});

function Index() {
  const site = Route.useLoaderData();
  return (
    <SiteProvider site={site}>
      <main className="min-h-screen bg-background font-sans">
        <Navbar />
        <Hero />
        <TeamStats />
        <About />
        <Formation />
        <Squad />
        <NextMatch />
        <MatchCenter />
        <SocialLinks />
        <SiteFooter />
        <ScrollToTop />
      </main>
    </SiteProvider>
  );
}
