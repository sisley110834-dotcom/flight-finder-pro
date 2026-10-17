import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brand } from "@/components/Brand";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const navigate = useNavigate();
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
    if (error) return toast.error(error.message);
    if (!data.session) return toast.success("請到信箱確認帳號 · Check your email to confirm.");
    navigate({ to: "/app", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background bg-hero-glow px-4">
      <div className="mb-8"><Brand /></div>
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-8 shadow-glow">
        <div>
          <h1 className="text-2xl font-semibold text-card-foreground">{isSignup ? "建立帳號 · Sign up" : "登入 · Sign in"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{isSignup ? "Start watching fares from Taipei." : "Welcome back."}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password / 密碼</Label>
          <Input id="password" type="password" required minLength={6} autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={loading}>
          {loading ? "…" : isSignup ? "Sign up / 註冊" : "Sign in / 登入"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? "已經有帳號？ " : "還沒有帳號？ "}
          <Link to={isSignup ? "/auth" : "/signup"} className="text-primary hover:underline">
            {isSignup ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </form>
    </div>
  );
}
