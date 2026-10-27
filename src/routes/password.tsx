import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageMeta, type MetaTag } from "@/lib/head";

const forgotMeta: MetaTag[] = [
  { title: "Forgot password — Flight Price Notifier" },
  { name: "robots", content: "noindex" },
];

const resetMeta: MetaTag[] = [
  { title: "Reset password — Flight Price Notifier" },
  { name: "robots", content: "noindex" },
];

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper bg-hero-glow px-4">
      <div className="mb-8">
        <Brand />
      </div>
      <div className="label-card w-full max-w-sm space-y-5 rounded-lg p-8">{children}</div>
    </div>
  );
}

// Sends a Supabase recovery email whose link lands on /reset-password.
export function ForgotPassword() {
  usePageMeta(forgotMeta);
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
        <h1 className="font-display text-2xl text-card-foreground">忘記密碼 · Forgot password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {sent
            ? "重設連結已寄出，請到信箱收信。 · Check your email for a reset link."
            : "輸入註冊的 Email，我們會寄重設密碼連結給你。"}
        </p>
      </div>
      {!sent && (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            {loading ? "…" : "Send reset link / 寄送連結"}
          </Button>
        </form>
      )}
      <p className="text-center text-sm text-muted-foreground">
        <Link to="/auth" className="text-primary hover:underline">
          Back to sign in / 回到登入
        </Link>
      </p>
    </Shell>
  );
}

// Landing page for the recovery link: Supabase signs the user in from the URL, then they set a new password.
export function ResetPassword() {
  usePageMeta(resetMeta);
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
    toast.success("密碼已更新 · Password updated");
    navigate("/app", { replace: true });
  }

  return (
    <Shell>
      <div>
        <h1 className="font-display text-2xl text-card-foreground">設定新密碼 · New password</h1>
        {ready === false && (
          <p className="mt-1 text-sm text-muted-foreground">
            連結無效或已過期，請重新申請。 · This link is invalid or expired.
          </p>
        )}
      </div>
      {ready ? (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New password / 新密碼</Label>
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
            {loading ? "…" : "Save / 儲存"}
          </Button>
        </form>
      ) : (
        ready === false && (
          <p className="text-center text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Send a new link / 重新寄送
            </Link>
          </p>
        )
      )}
    </Shell>
  );
}
