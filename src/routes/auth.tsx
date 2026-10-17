import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Flight Price Notifier" },
      { name: "description", content: "Sign in to Flight Price Notifier to manage your fare alerts." },
      { property: "og:title", content: "Sign in — Flight Price Notifier" },
      { property: "og:description", content: "登入機票降價通知。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AuthForm mode="signin" />,
});
