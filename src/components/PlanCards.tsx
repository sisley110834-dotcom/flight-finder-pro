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
import { useT, type MessageKey } from "@/lib/i18n";

const PLANS: { name: PlanName; titleKey: MessageKey; route: string; hint: number }[] = [
  { name: "tokyo", titleKey: "plan.tokyo", route: "TPE-TYO", hint: 9325 },
  { name: "seoul", titleKey: "plan.seoul", route: "TPE-SEL", hint: 5989 },
  { name: "paris", titleKey: "plan.paris", route: "TPE-PAR", hint: 24846 },
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
  { textKey: MessageKey; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  active: { textKey: "plan.badge.active", variant: "default" },
  unpaid: { textKey: "plan.badge.unpaid", variant: "destructive" },
  grace: { textKey: "plan.badge.grace", variant: "secondary" },
  ended: { textKey: "plan.badge.ended", variant: "outline" },
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
  const t = useT();
  const title = t(plan.titleKey);
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
      toast.success(t("plan.targetUpdated", { plan: title }));
      setEditing(false);
      setPrice("");
      await queryClient.invalidateQueries({ queryKey: ["subscriptions", email] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const cancel = useMutation({
    mutationFn: () => cancelSubscription({ email, route: plan.route }),
    onSuccess: async () => {
      toast.success(t("plan.cancelled", { plan: title }));
      await queryClient.invalidateQueries({ queryKey: ["subscriptions", email] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(price);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error(t("plan.invalidPrice"));
      return;
    }
    mutation.mutate({ target_price: Math.round(n) });
  }

  function confirmCancel() {
    if (
      window.confirm(t("plan.confirmCancel", { plan: title, end: endDate ?? t("plan.periodEnd") }))
    ) {
      cancel.mutate();
    }
  }

  const busy = loading || mutation.isPending || cancel.isPending;
  const showForm = state === "none" || state === "ended" || editing;
  const inputId = `target-${plan.name}`;
  const submitLabel = mutation.isPending
    ? t("plan.sending")
    : paid
      ? t("plan.save")
      : t("plan.subscribePay", { price: MONTHLY_PRICE_TWD });

  return (
    <div className="label-card rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display flex items-center gap-2 text-2xl text-card-foreground">
          <Plane className="size-5" /> {title}
        </h2>
        {state !== "none" && (
          <Badge variant={BADGE[state].variant}>{t(BADGE[state].textKey)}</Badge>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("plan.recentLow", { price: twd(plan.hint) })}
      </p>

      {current && state !== "ended" && !editing && (
        <div className="mt-4">
          <p className="text-card-foreground">
            {t("plan.currentTarget", { price: twd(current.target_price) })}
          </p>
          {state === "active" && endDate && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("plan.activeUntil", { end: endDate })}
            </p>
          )}
          {state === "grace" && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("plan.graceUntil", { end: endDate ?? "" })}
            </p>
          )}
          {state === "unpaid" && (
            <p className="mt-1 text-sm text-muted-foreground">{t("plan.unpaidNote")}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {state === "unpaid" && (
              <Button
                onClick={() => mutation.mutate({ target_price: current.target_price })}
                disabled={busy}
              >
                {mutation.isPending
                  ? t("plan.redirecting")
                  : t("plan.completePay", { price: MONTHLY_PRICE_TWD })}
              </Button>
            )}
            <Button variant="outline" onClick={() => setEditing(true)} disabled={busy}>
              {t("plan.updateTarget")}
            </Button>
            {state === "grace" && (
              <Button
                onClick={() =>
                  mutation.mutate({ target_price: current.target_price, resubscribe: true })
                }
                disabled={busy}
              >
                {mutation.isPending
                  ? t("plan.redirecting")
                  : t("plan.resubscribePay", { price: MONTHLY_PRICE_TWD })}
              </Button>
            )}
            {state === "active" && (
              <Button variant="ghost" onClick={confirmCancel} disabled={busy}>
                {cancel.isPending ? t("plan.cancelling") : t("plan.cancelSubscription")}
              </Button>
            )}
          </div>
        </div>
      )}

      {state === "ended" && !editing && (
        <p className="mt-4 text-sm text-muted-foreground">{t("plan.endedNote")}</p>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <Label htmlFor={inputId}>{t("plan.targetLabel")}</Label>
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
                  ? t("plan.sending")
                  : t("plan.resubscribe")
                : submitLabel}
            </Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                {t("plan.cancel")}
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
