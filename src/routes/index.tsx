import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TeamStats } from "@/components/TeamStats";
import { About } from "@/components/About";
import { Formation } from "@/components/Formation";
import { Squad } from "@/components/Squad";
import { NextMatch } from "@/components/NextMatch";
import { Friendlies } from "@/components/Friendlies";
import { SocialLinks } from "@/components/SocialLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollToTop } from "@/components/ScrollToTop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Driblou Caiu · Time de Pro Clubs no EA FC 26" },
      {
        name: "description",
        content:
          "Elenco, esquema tático e amistosos do Driblou Caiu, clube de Pro Clubs do EA FC 26.",
      },
      { property: "og:title", content: "Driblou Caiu · Pro Clubs EA FC 26" },
      {
        property: "og:description",
        content: "Conheça o elenco, o esquema tático, os números e os resultados do Driblou Caiu.",
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
      <Navbar />
      <Hero />
      <TeamStats />
      <About />
      <Formation />
      <Squad />
      <NextMatch />
      <Friendlies />
      <SocialLinks />
      <SiteFooter />
      <ScrollToTop />
    </main>
  );
}
