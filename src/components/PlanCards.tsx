import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plane } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listSubscriptions, subscribe, type PlanName, type Subscription } from "@/lib/flight-api";

const PLANS: { name: PlanName; title: string; route: string; hint: number }[] = [
  { name: "tokyo", title: "台北 ✈ 東京", route: "TPE-TYO", hint: 9325 },
  { name: "seoul", title: "台北 ✈ 首爾", route: "TPE-SEL", hint: 5989 },
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

  const mutation = useMutation({
    mutationFn: (target_price: number) => subscribe({ email, plan_name: plan.name, target_price }),
    onSuccess: async () => {
      toast.success(`已開始追蹤 ${plan.title}`);
      setEditing(false);
      setPrice("");
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
    mutation.mutate(Math.round(n));
  }

  const showForm = !current || editing;
  const inputId = `target-${plan.name}`;

  return (
    <div className="label-card rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display flex items-center gap-2 text-2xl text-card-foreground">
          <Plane className="size-5" /> {plan.title}
        </h2>
        {current && <Badge>已訂閱</Badge>}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">最近最低價約 {twd(plan.hint)}</p>

      {current && !editing && (
        <div className="mt-4">
          <p className="text-card-foreground">目前目標價：{twd(current.target_price)}</p>
          <Button className="mt-4" variant="outline" onClick={() => setEditing(true)}>
            更新目標價
          </Button>
        </div>
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
            disabled={loading || mutation.isPending}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || mutation.isPending}>
              {mutation.isPending ? "送出中…" : current ? "儲存" : "開始追蹤"}
            </Button>
            {current && (
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
