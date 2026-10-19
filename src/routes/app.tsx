import { useNavigate, useRouteLoaderData } from "react-router";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Brand, SiteFooter } from "@/components/Brand";
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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Brand />
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut /> Sign out / 登出
          </Button>
        </div>
      </header>
      <main className="flex-1 bg-hero-glow">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h1 className="break-all text-3xl font-bold text-foreground sm:text-4xl">Hi {user.email}</h1>
          <div className="mt-8 rounded-2xl border border-dashed border-primary/40 bg-card p-8">
            <p className="text-lg text-card-foreground">你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your dashboard is coming soon. Route-subscription will be added in the next milestone.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
