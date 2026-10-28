import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plane } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MONTHLY_PRICE_TWD,
  cancelSubscription,
  listSubscriptions,
  subscribe,
  type PlanName,
  type Subscription,
} from "@/lib/flight-api";

const PLANS: { name: PlanName; title: string; route: string; hint: number }[] = [
  { name: "tokyo", title: "台北 ✈ 東京", route: "TPE-TYO", hint: 9325 },
  { name: "seoul", title: "台北 ✈ 首爾", route: "TPE-SEL", hint: 5989 },
  { name: "paris", title: "台北 ✈ 巴黎", route: "TPE-PAR", hint: 24846 },
];

const twd = (n: number) => `NT$${n.toLocaleString("en-US")}`;

export function PlanCards({ email }: { email: string }) {
  const { data: subs, isLoading } = useQuery({
    queryKey: ["subscriptions", email],
    queryFn: () => listSubscriptions(email),
  });

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {PLANS.map((plan) => (
        <PlanCard
          key={plan.name}
          plan={plan}
          email={email}
          loading={isLoading}
          current={subs?.find((s) => s.route === plan.route)}
        />
      ))}
    </div>
  );
}

type CardState = "none" | "unpaid" | "active" | "grace" | "ended";

function cardState(sub: Subscription | undefined): CardState {
  if (!sub) return "none";
  const status = sub.subscription_status;
  if (status === "active") return "active";
  if (status === "cancelled") {
    const end = sub.current_period_end;
    return end && new Date(end).getTime() >= Date.now() ? "grace" : "ended";
  }
  if (status === "expired") return "ended";
  return "unpaid";
}

const BADGE: Record<
  Exclude<CardState, "none">,
  { text: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  active: { text: "已訂閱", variant: "default" },
  unpaid: { text: "未完成付款", variant: "destructive" },
  grace: { text: "已取消", variant: "secondary" },
  ended: { text: "已結束", variant: "outline" },
};

function PlanCard({
  plan,
  email,
  loading,
  current,
}: {
  plan: (typeof PLANS)[number];
  email: string;
  loading: boolean;
  current: Subscription | undefined;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState("");
  const state = cardState(current);
  const paid = state === "active" || state === "grace";
  const endDate = current?.current_period_end_date ?? current?.current_period_end?.slice(0, 10);

  const mutation = useMutation({
    mutationFn: ({ target_price, resubscribe }: { target_price: number; resubscribe?: boolean }) =>
      subscribe({ email, plan_name: plan.name, target_price, resubscribe }),
    onSuccess: async (result) => {
      // "checkout" has already replaced the page with the ECPay cashier.
      if (result !== "updated") return;
      toast.success(`已更新 ${plan.title} 的目標價`);
      setEditing(false);
      setPrice("");
      await queryClient.invalidateQueries({ queryKey: ["subscriptions", email] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const cancel = useMutation({
    mutationFn: () => cancelSubscription({ email, route: plan.route }),
    onSuccess: async () => {
      toast.success(`已取消 ${plan.title} 訂閱，已付費期間內仍會通知你`);
      await queryClient.invalidateQueries({ queryKey: ["subscriptions", email] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(price);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("請輸入正確的目標價 (TWD)");
      return;
    }
    mutation.mutate({ target_price: Math.round(n) });
  }

  function confirmCancel() {
    if (
      window.confirm(
        `確定要取消 ${plan.title} 訂閱嗎？之後不會再扣款，${endDate ?? "本期結束"} 前仍會通知你。`,
      )
    ) {
      cancel.mutate();
    }
  }

  const busy = loading || mutation.isPending || cancel.isPending;
  const showForm = state === "none" || state === "ended" || editing;
  const inputId = `target-${plan.name}`;
  const submitLabel = mutation.isPending
    ? "送出中…"
    : paid
      ? "儲存"
      : `訂閱並付款 NT$${MONTHLY_PRICE_TWD}/月`;

  return (
    <div className="label-card rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display flex items-center gap-2 text-2xl text-card-foreground">
          <Plane className="size-5" /> {plan.title}
        </h2>
        {state !== "none" && <Badge variant={BADGE[state].variant}>{BADGE[state].text}</Badge>}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">最近最低價約 {twd(plan.hint)}</p>

      {current && state !== "ended" && !editing && (
        <div className="mt-4">
          <p className="text-card-foreground">目前目標價：{twd(current.target_price)}</p>
          {state === "active" && endDate && (
            <p className="mt-1 text-sm text-muted-foreground">本期有效至 {endDate}，每月自動續訂</p>
          )}
          {state === "grace" && (
            <p className="mt-1 text-sm text-muted-foreground">
              有效至 {endDate}（仍會通知到該日，之後不再扣款）
            </p>
          )}
          {state === "unpaid" && (
            <p className="mt-1 text-sm text-muted-foreground">付款完成後才會開始寄送降價通知。</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {state === "unpaid" && (
              <Button
                onClick={() => mutation.mutate({ target_price: current.target_price })}
                disabled={busy}
              >
                {mutation.isPending ? "前往付款…" : `完成付款 NT$${MONTHLY_PRICE_TWD}/月`}
              </Button>
            )}
            <Button variant="outline" onClick={() => setEditing(true)} disabled={busy}>
              更新目標價
            </Button>
            {state === "grace" && (
              <Button
                onClick={() =>
                  mutation.mutate({ target_price: current.target_price, resubscribe: true })
                }
                disabled={busy}
              >
                {mutation.isPending ? "前往付款…" : `重新訂閱 NT$${MONTHLY_PRICE_TWD}/月`}
              </Button>
            )}
            {state === "active" && (
              <Button variant="ghost" onClick={confirmCancel} disabled={busy}>
                {cancel.isPending ? "取消中…" : "取消訂閱"}
              </Button>
            )}
          </div>
        </div>
      )}

      {state === "ended" && !editing && (
        <p className="mt-4 text-sm text-muted-foreground">訂閱已結束，重新付款即可恢復通知。</p>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <Label htmlFor={inputId}>目標價 (TWD)</Label>
          <Input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={1}
            placeholder={String(current?.target_price ?? plan.hint + 1000)}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={busy}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>
              {state === "ended" && !editing
                ? mutation.isPending
                  ? "送出中…"
                  : "重新訂閱"
                : submitLabel}
            </Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                取消
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
