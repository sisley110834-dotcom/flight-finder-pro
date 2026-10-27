import { Link } from "react-router";
import { Radar, BellRing, CalendarX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand, SiteFooter } from "@/components/Brand";
import flightSky from "@/assets/flight-sky.jpg";
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
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Brand />
          <Button asChild variant="hero" size="sm" className="px-5">
            <Link to="/auth">Sign in / 登入</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <img src={flightSky} alt="An airplane above the clouds" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-left sm:object-center" />
          <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-semibold text-foreground">
                台北出發 · Taipei departures
              </p>
              <h1 className="brand-name text-4xl leading-relaxed sm:text-6xl">
                Flight Price<br />Notifier
              </h1>
              <p className="mt-6 max-w-lg text-xl font-semibold leading-relaxed text-foreground sm:text-2xl">設定航線與目標價，機票降價就通知你</p>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-foreground">
                Set a route and a target price — we email you when the fare drops.
              </p>
              <div className="mt-7 flex">
                <Button asChild variant="hero" size="lg">
                  <Link to="/signup">免費開始 · Get started <ArrowRight /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
                <div key={f.en} className="label-card h-full rounded-lg p-6 transition-transform motion-safe:hover:-translate-y-1">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-accent text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl text-card-foreground">{f.title}</h3>
                  <p className="text-sm font-medium text-olive">{f.en}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
