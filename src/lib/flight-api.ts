// Flight Price Notifier backend (AWS API Gateway). Public endpoint; the browser holds no AWS credentials.
export const FLIGHT_API_URL =
  import.meta.env["VITE_FLIGHT_API_URL"] ??
  "https://jm0bw3q24c.execute-api.us-east-1.amazonaws.com";

export type PlanName = "tokyo" | "seoul" | "paris";

export type Subscription = {
  email: string;
  route: string;
  plan_name: PlanName;
  target_price: number;
  currency: "TWD";
  updated_at: string;
};

export async function listSubscriptions(email: string): Promise<Subscription[]> {
  const res = await fetch(`${FLIGHT_API_URL}/subscriptions?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(`讀取訂閱失敗 (${res.status})`);
  const body = (await res.json()) as { items: Subscription[] };
  return body.items;
}

export async function subscribe(input: {
  email: string;
  plan_name: PlanName;
  target_price: number;
}): Promise<void> {
  const res = await fetch(`${FLIGHT_API_URL}/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `訂閱失敗 (${res.status})`);
  }
}
