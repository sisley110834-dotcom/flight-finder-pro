import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Flight Price Notifier" },
      { name: "description", content: "Create a Flight Price Notifier account and get fare-drop emails." },
      { property: "og:title", content: "Sign up — Flight Price Notifier" },
      { property: "og:description", content: "註冊機票降價通知。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
