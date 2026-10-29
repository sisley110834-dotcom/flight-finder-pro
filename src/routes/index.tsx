import { Link } from "react-router";
import { Radar, BellRing, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand, SiteFooter } from "@/components/Brand";
import { Reveal } from "@/components/Reveal";
import { Lemon, OliveSprig, WaveRule } from "@/components/Ornaments";
import { LanguageSelect } from "@/components/LanguageSelect";
import { usePageMeta } from "@/lib/head";
import { useT } from "@/lib/i18n";

const features = [
  { icon: Radar, key: "f1" },
  { icon: BellRing, key: "f2" },
  { icon: CalendarX, key: "f3" },
] as const;

export function Index() {
  const t = useT();
  usePageMeta([
    { title: t("home.metaTitle") },
    { name: "description", content: t("home.metaDescription") },
    { property: "og:title", content: t("home.metaTitle") },
    { property: "og:description", content: t("home.metaDescription") },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]);
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b-2 border-primary bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Brand />
          <div className="flex items-center gap-2">
            <LanguageSelect />
            <Button asChild variant="hero" size="sm" className="px-5">
              <Link to="/auth">{t("nav.signIn")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-hero-glow">
          <OliveSprig className="absolute -left-10 top-6 w-40 sm:left-[4%] sm:w-56" />
          <Lemon className="absolute bottom-10 left-[6%] w-10 sm:bottom-16 sm:left-[12%] sm:w-14" />
          <OliveSprig className="absolute -right-10 bottom-8 w-40 -scale-x-100 sm:right-[4%] sm:w-56" />
          <Lemon className="absolute right-[4%] top-16 w-12 sm:right-[16%] sm:top-20 sm:w-16" />
          <Lemon className="absolute bottom-24 right-[22%] hidden w-10 md:block" />
          <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
            <Reveal>
              <p className="mx-auto mb-6 inline-block rounded-full border-2 border-primary bg-card px-4 py-1 text-xs font-medium tracking-wider text-primary">
                {t("home.routes")}
              </p>
              <h1 className="brand-name text-6xl leading-tight sm:text-8xl">
                Flight Price Notifier
              </h1>
              <WaveRule className="mx-auto mt-6 w-48 sm:w-60" />
              <p className="font-display mt-6 text-xl text-foreground sm:text-2xl">{t("home.tagline")}</p>
              <p className="mt-3 text-base text-muted-foreground">
                {t("home.subtitle")}
              </p>
              <div className="mt-10 flex justify-center">
                <Button asChild variant="hero" size="lg">
                  <Link to="/signup">{t("home.cta")}</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.key} delay={i * 100}>
                <div className="label-card h-full rounded-[2rem] p-6 transition-transform hover:-translate-y-1">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-full border-2 border-primary bg-accent text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl text-card-foreground">{t(`home.${f.key}.title`)}</h3>
                  <p className="text-sm font-medium text-olive">{t(`home.${f.key}.sub`)}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(`home.${f.key}.body`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
