import { translate } from "@/lib/i18n";

// Flight Price Notifier backend (AWS API Gateway). Public endpoint; the browser holds no AWS credentials.
export const FLIGHT_API_URL =
  import.meta.env["VITE_FLIGHT_API_URL"] ??
  "https://jm0bw3q24c.execute-api.us-east-1.amazonaws.com";

// Display only; the charged amount comes from the `amount` in the flight/ecpay secret.
export const MONTHLY_PRICE_TWD = Number(import.meta.env["VITE_MONTHLY_PRICE_TWD"] ?? 300);

export type PlanName = "tokyo" | "seoul" | "paris";

export type SubscriptionStatus = "pending_payment" | "active" | "cancelled" | "expired";

export type Subscription = {
  email: string;
  route: string;
  plan_name: PlanName;
  target_price: number;
  currency: "TWD";
  updated_at: string;
  // Missing on rows saved before payments existed; treat those as unpaid.
  subscription_status?: SubscriptionStatus;
  current_period_end?: string;
  current_period_end_date?: string;
};

export async function listSubscriptions(email: string): Promise<Subscription[]> {
  const res = await fetch(`${FLIGHT_API_URL}/subscriptions?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(translate("api.loadFailed", { status: res.status }));
  const body = (await res.json()) as { items: Subscription[] };
  return body.items;
}

export async function subscribe(input: {
  email: string;
  plan_name: PlanName;
  target_price: number;
  // Start a new paid order for a cancelled subscription that is still in its paid period.
  resubscribe?: boolean | undefined;
}): Promise<"checkout" | "updated"> {
  const res = await fetch(`${FLIGHT_API_URL}/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? translate("api.subscribeFailed", { status: res.status }));
  }
  // Unpaid: the API returns an auto-submitting ECPay checkout form. Paid (or cancelled but
  // still in its paid period): the target price was updated in place and the API returns JSON.
  if (res.headers.get("content-type")?.includes("text/html")) {
    const html = await res.text();
    document.open();
    document.write(html);
    document.close();
    return "checkout";
  }
  return "updated";
}

export async function cancelSubscription(input: { email: string; route: string }): Promise<void> {
  const res = await fetch(`${FLIGHT_API_URL}/cancel`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? translate("api.cancelFailed", { status: res.status }));
  }
}
