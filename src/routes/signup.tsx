import { AuthForm } from "@/components/AuthForm";
import { usePageMeta } from "@/lib/head";
import { useT } from "@/lib/i18n";

export function SignUp() {
  const t = useT();
  usePageMeta([
    { title: `${t("auth.signUpTitle")} — Flight Price Notifier` },
    { name: "description", content: t("auth.signUpMetaDescription") },
    { property: "og:title", content: `${t("auth.signUpTitle")} — Flight Price Notifier` },
    { property: "og:description", content: t("auth.signUpMetaDescription") },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]);
  return <AuthForm mode="signup" />;
}
