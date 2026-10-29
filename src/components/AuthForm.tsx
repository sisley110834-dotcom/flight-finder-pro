import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import type { Provider } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brand } from "@/components/Brand";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useT } from "@/lib/i18n";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const navigate = useNavigate();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/app" } })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.code === "invalid_credentials" ? t("auth.wrongCredentials") : error.message);
      return;
    }
    if (!data.session) { toast.success(t("auth.checkEmail")); return; }
    navigate("/app", { replace: true });
  }

  // Google / Facebook: Supabase redirects to the provider, then back to /app with the session
  // (a first-time social sign-in creates the account, so this serves sign-up and sign-in).
  async function onOAuth(provider: Provider, label: string) {
    setLoading(true);
    // Until the provider is switched on in Supabase, its authorize URL is a raw JSON error page,
    // so check first and explain instead of redirecting there.
    if ((await providerEnabled(provider)) === false) {
      setLoading(false);
      toast.error(t("auth.providerUnavailable", { provider: label }));
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + "/app" },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-paper bg-hero-glow px-4">
      <div className="absolute right-4 top-4"><LanguageSelect /></div>
      <div className="mb-8"><Brand /></div>
      <form onSubmit={onSubmit} className="label-card w-full max-w-sm space-y-5 rounded-[2rem] p-8">
        <div>
          <h1 className="font-display text-2xl text-card-foreground">{isSignup ? t("auth.signUpTitle") : t("auth.signInTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{isSignup ? t("auth.signUpSub") : t("auth.signInSub")}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input className="bg-card" id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input className="bg-card" id="password" type="password" required minLength={6} autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
          {!isSignup && (
            <p className="text-right text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">{t("auth.forgot")}</Link>
            </p>
          )}
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={loading}>
          {loading ? "…" : isSignup ? t("auth.submitSignUp") : t("auth.submitSignIn")}
        </Button>
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {t("auth.or")}
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="space-y-3">
          <Button type="button" variant="outline" className="w-full rounded-full border-2 border-primary bg-card text-primary" disabled={loading} onClick={() => void onOAuth("google", "Google")}>
            <GoogleIcon /> {t("auth.google")}
          </Button>
          <Button type="button" variant="outline" className="w-full rounded-full border-2 border-primary bg-card text-primary" disabled={loading} onClick={() => void onOAuth("facebook", "Facebook")}>
            <FacebookIcon /> {t("auth.facebook")}
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
          <Link to={isSignup ? "/auth" : "/signup"} className="text-primary hover:underline">
            {isSignup ? t("auth.linkSignIn") : t("auth.linkSignUp")}
          </Link>
        </p>
      </form>
    </div>
  );
}

// Reads the project's public auth settings; `undefined` when they can't be fetched (then just try).
async function providerEnabled(provider: Provider): Promise<boolean | undefined> {
  try {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    });
    if (!res.ok) return undefined;
    const settings = (await res.json()) as { external?: Record<string, boolean> };
    return settings.external?.[provider];
  } catch {
    return undefined;
  }
}

// Single-color brand marks so they sit in the cobalt ink theme.
function GoogleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.7 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.68 3.7 14.55 2.7 12 2.7 6.87 2.7 2.7 6.87 2.7 12s4.17 9.3 9.3 9.3c5.37 0 8.93-3.77 8.93-9.08 0-.61-.07-1.08-.15-1.54z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}
