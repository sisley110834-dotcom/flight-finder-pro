import { useEffect } from "react";
import { useNavigate, useRouteLoaderData, useSearchParams } from "react-router";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Brand, SiteFooter } from "@/components/Brand";
import { PlanCards } from "@/components/PlanCards";
import { LanguageSelect } from "@/components/LanguageSelect";
import { usePageMeta } from "@/lib/head";
import { useT } from "@/lib/i18n";

export function AppPage() {
  const t = useT();
  usePageMeta([
    { title: t("app.metaTitle") },
    { name: "description", content: t("app.metaDescription") },
    { property: "og:title", content: t("app.metaTitle") },
    { property: "og:description", content: t("app.metaDescription") },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ]);
  const { user } = useRouteLoaderData("authenticated") as { user: User };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();
  const purchase = params.get("purchase");

  // ECPay sends the browser back here after checkout. This is only a message: the
  // subscription is activated by ECPay's server-to-server callback, which may land a moment later.
  useEffect(() => {
    if (!purchase) return;
    if (purchase === "success") {
      toast.success(t("app.paySuccess"));
      const timer = setTimeout(
        () => queryClient.invalidateQueries({ queryKey: ["subscriptions"] }),
        3000,
      );
      setParams({}, { replace: true });
      return () => clearTimeout(timer);
    }
    toast.error(t("app.payFailed"));
    setParams({}, { replace: true });
    return undefined;
    // `t` is left out on purpose: switching language must not re-show the payment toast.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchase, queryClient, setParams]);

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
          <div className="flex items-center gap-2">
            <LanguageSelect />
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut /> {t("nav.signOut")}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-hero-glow">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h1 className="font-display break-all text-3xl text-foreground sm:text-4xl">
            {t("app.greeting", { email: user.email ?? "" })}
          </h1>
          <p className="mt-4 text-card-foreground">{t("app.intro")}</p>
          <PlanCards email={user.email ?? ""} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
