import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSelect } from "@/components/LanguageSelect";
import { usePageMeta } from "@/lib/head";
import { useT } from "@/lib/i18n";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-paper bg-hero-glow px-4">
      <div className="absolute right-4 top-4">
        <LanguageSelect />
      </div>
      <div className="mb-8">
        <Brand />
      </div>
      <div className="label-card w-full max-w-sm space-y-5 rounded-[2rem] p-8">{children}</div>
    </div>
  );
}

// Sends a Supabase recovery email whose link lands on /reset-password.
export function ForgotPassword() {
  const t = useT();
  usePageMeta([
    { title: `${t("password.forgotTitle")} — Flight Price Notifier` },
    { name: "robots", content: "noindex" },
  ]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <Shell>
      <div>
        <h1 className="font-display text-2xl text-card-foreground">{t("password.forgotTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {sent ? t("password.forgotSent") : t("password.forgotSub")}
        </p>
      </div>
      {!sent && (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              className="bg-card"
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? "…" : t("password.sendLink")}
          </Button>
        </form>
      )}
      <p className="text-center text-sm text-muted-foreground">
        <Link to="/auth" className="text-primary hover:underline">
          {t("password.backToSignIn")}
        </Link>
      </p>
    </Shell>
  );
}

// Landing page for the recovery link: Supabase signs the user in from the URL, then they set a new password.
export function ResetPassword() {
  const t = useT();
  usePageMeta([
    { title: `${t("password.resetTitle")} — Flight Price Notifier` },
    { name: "robots", content: "noindex" },
  ]);
  const navigate = useNavigate();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    void supabase.auth.getSession().then(({ data: s }) => setReady((r) => r || !!s.session));
    return () => data.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("password.updated"));
    navigate("/app", { replace: true });
  }

  return (
    <Shell>
      <div>
        <h1 className="font-display text-2xl text-card-foreground">{t("password.resetTitle")}</h1>
        {ready === false && (
          <p className="mt-1 text-sm text-muted-foreground">{t("password.invalidLink")}</p>
        )}
      </div>
      {ready ? (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">{t("password.newPassword")}</Label>
            <Input
              className="bg-card"
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? "…" : t("password.save")}
          </Button>
        </form>
      ) : (
        ready === false && (
          <p className="text-center text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              {t("password.sendNewLink")}
            </Link>
          </p>
        )
      )}
    </Shell>
  );
}
