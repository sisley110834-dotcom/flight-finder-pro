import { Link } from "react-router";
import { Radar, BellRing, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand, SiteFooter } from "@/components/Brand";
import { Reveal } from "@/components/Reveal";
import { usePageMeta, type MetaTag } from "@/lib/head";

const meta: MetaTag[] = [
  { title: "Flight Price Notifier — 機票降價通知" },
  { name: "description", content: "Set a route and a target price — we email you when the fare drops. 台北出發熱門航線降價通知。" },
  { property: "og:title", content: "Flight Price Notifier — 機票降價通知" },
  { property: "og:description", content: "設定航線與目標價，機票降價就通知你。" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
];

const features = [
  { icon: Radar, title: "盯緊熱門航線", en: "Always-on route watching", body: "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。" },
  { icon: BellRing, title: "達標自動通知", en: "Target-price email alerts", body: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。" },
  { icon: CalendarX, title: "隨時取消", en: "Cancel anytime", body: "月訂閱制，不想用隨時停，沒有綁約。" },
];

export function Index() {
  usePageMeta(meta);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Brand />
          <Button asChild variant="hero" size="sm" className="px-5">
            <Link to="/auth">Sign in / 登入</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-hero-glow">
          <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
            <Reveal>
              <p className="mx-auto mb-6 inline-block rounded-full border border-border bg-card/60 px-4 py-1 text-xs text-muted-foreground">
                台北出發 · Taipei departures
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Flight Price <span className="text-gradient">Notifier</span>
              </h1>
              <p className="mt-6 text-xl font-medium text-foreground sm:text-2xl">設定航線與目標價，機票降價就通知你</p>
              <p className="mt-3 text-base text-muted-foreground">
                Set a route and a target price — we email you when the fare drops.
              </p>
              <div className="mt-10 flex justify-center">
                <Button asChild variant="hero" size="lg">
                  <Link to="/signup">免費開始 · Get started</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.en} delay={i * 100}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">{f.title}</h3>
                  <p className="text-sm text-primary">{f.en}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
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
