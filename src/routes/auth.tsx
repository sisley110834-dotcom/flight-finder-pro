import { AuthForm } from "@/components/AuthForm";
import { usePageMeta } from "@/lib/head";
import { useT } from "@/lib/i18n";

export function SignIn() {
  const t = useT();
  usePageMeta([
    { title: `${t("auth.signInTitle")} — Flight Price Notifier` },
    { name: "description", content: t("auth.signInMetaDescription") },
    { property: "og:title", content: `${t("auth.signInTitle")} — Flight Price Notifier` },
    { property: "og:description", content: t("auth.signInMetaDescription") },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]);
  return <AuthForm mode="signin" />;
}
