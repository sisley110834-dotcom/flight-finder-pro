import { useNavigate, useRouteLoaderData } from "react-router";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Brand, SiteFooter } from "@/components/Brand";
import { PlanCards } from "@/components/PlanCards";
import { usePageMeta, type MetaTag } from "@/lib/head";

const meta: MetaTag[] = [
  { title: "Dashboard — Flight Price Notifier" },
  { name: "description", content: "Your Flight Price Notifier route-watching dashboard." },
  { property: "og:title", content: "Dashboard — Flight Price Notifier" },
  { property: "og:description", content: "你的航線追蹤儀表板。" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary" },
  { name: "robots", content: "noindex" },
];

export function AppPage() {
  usePageMeta(meta);
  const { user } = useRouteLoaderData("authenticated") as { user: User };
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b-2 border-primary bg-background/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Brand />
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut /> Sign out / 登出
          </Button>
        </div>
      </header>
      <main className="flex-1 bg-hero-glow">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h1 className="font-display break-all text-3xl text-foreground sm:text-4xl">
            Hi {user.email}
          </h1>
          <p className="mt-4 text-card-foreground">
            選一條航線、設定目標價，票價跌到目標以下時我們會寄信通知你。
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a route and a target price; we'll email you when the fare drops below it.
          </p>
          <PlanCards email={user.email ?? ""} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
