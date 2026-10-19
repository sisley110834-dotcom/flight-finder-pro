import { AuthForm } from "@/components/AuthForm";
import { usePageMeta, type MetaTag } from "@/lib/head";

const meta: MetaTag[] = [
  { title: "Sign up — Flight Price Notifier" },
  { name: "description", content: "Create a Flight Price Notifier account and get fare-drop emails." },
  { property: "og:title", content: "Sign up — Flight Price Notifier" },
  { property: "og:description", content: "註冊機票降價通知。" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary" },
];

export function SignUp() {
  usePageMeta(meta);
  return <AuthForm mode="signup" />;
}
