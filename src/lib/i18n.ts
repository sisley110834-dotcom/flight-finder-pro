import { useCallback, useSyncExternalStore } from "react";

// UI language (Chinese / English / French). The choice is kept in localStorage and shared by
// every component through a tiny external store, so pages outside the root layout (e.g. the
// error page) and non-React code (API error messages) can read it too.

export type Lang = "zh" | "en" | "fr";

export const LANGUAGES: { code: Lang; label: string; htmlLang: string }[] = [
  { code: "zh", label: "中文", htmlLang: "zh-Hant" },
  { code: "en", label: "English", htmlLang: "en" },
  { code: "fr", label: "Français", htmlLang: "fr" },
];

const zh = {
  "lang.label": "語言",
  "nav.signIn": "登入",
  "nav.signOut": "登出",

  "home.metaTitle": "Flight Price Notifier — 機票降價通知",
  "home.metaDescription": "設定航線與目標價，機票降價就通知你。",
  "home.routes": "TPE → TOKYO · CDG · VIE",
  "home.tagline": "設定航線與目標價，機票降價就通知你",
  "home.subtitle": "台北出發熱門航線，票價跌到目標價就寄 email 通知你。",
  "home.cta": "免費開始",
  "home.f1.title": "盯緊熱門航線",
  "home.f1.sub": "全天候航線監控",
  "home.f1.body": "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。",
  "home.f2.title": "達標自動通知",
  "home.f2.sub": "目標價 email 提醒",
  "home.f2.body": "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。",
  "home.f3.title": "隨時取消",
  "home.f3.sub": "沒有綁約",
  "home.f3.body": "月訂閱制，不想用隨時停，沒有綁約。",

  "auth.signInTitle": "登入",
  "auth.signUpTitle": "建立帳號",
  "auth.signInSub": "歡迎回來。",
  "auth.signUpSub": "開始追蹤台北出發的票價。",
  "auth.signInMetaDescription": "登入 Flight Price Notifier，管理你的降價通知。",
  "auth.signUpMetaDescription": "註冊 Flight Price Notifier，機票降價就寄 email 通知你。",
  "auth.email": "Email",
  "auth.password": "密碼",
  "auth.forgot": "忘記密碼？",
  "auth.submitSignIn": "登入",
  "auth.submitSignUp": "註冊",
  "auth.haveAccount": "已經有帳號？",
  "auth.noAccount": "還沒有帳號？",
  "auth.linkSignIn": "登入",
  "auth.linkSignUp": "註冊",
  "auth.wrongCredentials": "Email 或密碼錯誤，忘記密碼可點「忘記密碼？」重設。",
  "auth.checkEmail": "請到信箱確認帳號。",
  "auth.or": "或",
  "auth.google": "使用 Google 繼續",
  "auth.facebook": "使用 Facebook 繼續",
  "auth.providerUnavailable": "{provider} 登入尚未開放，請先使用 Email 登入。",

  "password.forgotTitle": "忘記密碼",
  "password.forgotSub": "輸入註冊的 Email，我們會寄重設密碼連結給你。",
  "password.forgotSent": "重設連結已寄出，請到信箱收信。",
  "password.sendLink": "寄送連結",
  "password.backToSignIn": "回到登入",
  "password.resetTitle": "設定新密碼",
  "password.invalidLink": "連結無效或已過期，請重新申請。",
  "password.newPassword": "新密碼",
  "password.save": "儲存",
  "password.sendNewLink": "重新寄送",
  "password.updated": "密碼已更新",

  "app.metaTitle": "儀表板 — Flight Price Notifier",
  "app.metaDescription": "你的航線追蹤儀表板。",
  "app.greeting": "Hi {email}",
  "app.intro": "選一條航線、設定目標價，票價跌到目標以下時我們會寄信通知你。",
  "app.paySuccess": "付款完成！訂閱啟用後就會開始寄送降價通知。",
  "app.payFailed": "付款未完成，可以在卡片上按「完成付款」再試一次。",

  "plan.tokyo": "台北 ✈ 東京",
  "plan.seoul": "台北 ✈ 首爾",
  "plan.paris": "台北 ✈ 巴黎",
  "plan.badge.active": "已訂閱",
  "plan.badge.unpaid": "未完成付款",
  "plan.badge.grace": "已取消",
  "plan.badge.ended": "已結束",
  "plan.recentLow": "最近最低價約 {price}",
  "plan.currentTarget": "目前目標價：{price}",
  "plan.activeUntil": "本期有效至 {end}，每月自動續訂",
  "plan.graceUntil": "有效至 {end}（仍會通知到該日，之後不再扣款）",
  "plan.unpaidNote": "付款完成後才會開始寄送降價通知。",
  "plan.endedNote": "訂閱已結束，重新付款即可恢復通知。",
  "plan.targetLabel": "目標價 (TWD)",
  "plan.targetUpdated": "已更新 {plan} 的目標價",
  "plan.cancelled": "已取消 {plan} 訂閱，已付費期間內仍會通知你",
  "plan.invalidPrice": "請輸入正確的目標價 (TWD)",
  "plan.confirmCancel": "確定要取消 {plan} 訂閱嗎？之後不會再扣款，{end} 前仍會通知你。",
  "plan.periodEnd": "本期結束",
  "plan.sending": "送出中…",
  "plan.save": "儲存",
  "plan.subscribePay": "訂閱並付款 NT${price}/月",
  "plan.redirecting": "前往付款…",
  "plan.completePay": "完成付款 NT${price}/月",
  "plan.updateTarget": "更新目標價",
  "plan.resubscribePay": "重新訂閱 NT${price}/月",
  "plan.cancelling": "取消中…",
  "plan.cancelSubscription": "取消訂閱",
  "plan.resubscribe": "重新訂閱",
  "plan.cancel": "取消",

  "api.loadFailed": "讀取訂閱失敗 ({status})",
  "api.subscribeFailed": "訂閱失敗 ({status})",
  "api.cancelFailed": "取消訂閱失敗 ({status})",

  "root.notFoundTitle": "找不到頁面",
  "root.notFoundBody": "你要找的頁面不存在或已移動。",
  "root.goHome": "回首頁",
  "root.errorTitle": "頁面載入失敗",
  "root.errorBody": "我們這邊出了點問題，請重新整理或回到首頁。",
  "root.tryAgain": "再試一次",
} as const;

export type MessageKey = keyof typeof zh;
type Messages = Record<MessageKey, string>;

const en: Messages = {
  "lang.label": "Language",
  "nav.signIn": "Sign in",
  "nav.signOut": "Sign out",

  "home.metaTitle": "Flight Price Notifier — Fare-drop alerts",
  "home.metaDescription": "Set a route and a target price — we email you when the fare drops.",
  "home.routes": "TPE → TOKYO · CDG · VIE",
  "home.tagline": "Set a route and a target price — we email you when the fare drops",
  "home.subtitle":
    "Popular routes from Taipei. When the fare hits your target, we send you an email.",
  "home.cta": "Get started free",
  "home.f1.title": "Always-on route watching",
  "home.f1.sub": "Popular routes, around the clock",
  "home.f1.body":
    "We keep watching popular routes from Taipei (Tokyo, Seoul) and catch the lowest fares automatically.",
  "home.f2.title": "Target-price email alerts",
  "home.f2.sub": "Know the moment it drops",
  "home.f2.body":
    "When the fare falls below your target, we email you with a link to book right away.",
  "home.f3.title": "Cancel anytime",
  "home.f3.sub": "No contract",
  "home.f3.body": "A monthly subscription you can stop whenever you like, with no lock-in.",

  "auth.signInTitle": "Sign in",
  "auth.signUpTitle": "Create an account",
  "auth.signInSub": "Welcome back.",
  "auth.signUpSub": "Start watching fares from Taipei.",
  "auth.signInMetaDescription": "Sign in to Flight Price Notifier to manage your fare alerts.",
  "auth.signUpMetaDescription": "Create a Flight Price Notifier account and get fare-drop emails.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.forgot": "Forgot password?",
  "auth.submitSignIn": "Sign in",
  "auth.submitSignUp": "Sign up",
  "auth.haveAccount": "Already have an account?",
  "auth.noAccount": "No account yet?",
  "auth.linkSignIn": "Sign in",
  "auth.linkSignUp": "Sign up",
  "auth.wrongCredentials": "Wrong email or password. Use “Forgot password?” to reset it.",
  "auth.checkEmail": "Check your email to confirm your account.",
  "auth.or": "or",
  "auth.google": "Continue with Google",
  "auth.facebook": "Continue with Facebook",
  "auth.providerUnavailable": "{provider} sign-in isn't available yet. Please use email for now.",

  "password.forgotTitle": "Forgot password",
  "password.forgotSub": "Enter your account email and we'll send you a reset link.",
  "password.forgotSent": "Check your email for a reset link.",
  "password.sendLink": "Send reset link",
  "password.backToSignIn": "Back to sign in",
  "password.resetTitle": "New password",
  "password.invalidLink": "This link is invalid or expired. Please request a new one.",
  "password.newPassword": "New password",
  "password.save": "Save",
  "password.sendNewLink": "Send a new link",
  "password.updated": "Password updated",

  "app.metaTitle": "Dashboard — Flight Price Notifier",
  "app.metaDescription": "Your Flight Price Notifier route-watching dashboard.",
  "app.greeting": "Hi {email}",
  "app.intro": "Pick a route and a target price; we'll email you when the fare drops below it.",
  "app.paySuccess": "Payment complete! Fare alerts start as soon as your subscription is active.",
  "app.payFailed": "Payment wasn't completed. Use “Complete payment” on the card to try again.",

  "plan.tokyo": "Taipei ✈ Tokyo",
  "plan.seoul": "Taipei ✈ Seoul",
  "plan.paris": "Taipei ✈ Paris",
  "plan.badge.active": "Subscribed",
  "plan.badge.unpaid": "Payment pending",
  "plan.badge.grace": "Cancelled",
  "plan.badge.ended": "Ended",
  "plan.recentLow": "Recent low: about {price}",
  "plan.currentTarget": "Current target: {price}",
  "plan.activeUntil": "Active until {end}; renews monthly",
  "plan.graceUntil": "Active until {end} (alerts until then, no further charges)",
  "plan.unpaidNote": "Fare alerts start once payment is complete.",
  "plan.endedNote": "This subscription has ended. Pay again to resume alerts.",
  "plan.targetLabel": "Target price (TWD)",
  "plan.targetUpdated": "Target price updated for {plan}",
  "plan.cancelled":
    "{plan} subscription cancelled. You'll still get alerts until the paid period ends.",
  "plan.invalidPrice": "Enter a valid target price (TWD)",
  "plan.confirmCancel":
    "Cancel your {plan} subscription? You won't be charged again, and you'll still get alerts until {end}.",
  "plan.periodEnd": "the end of this period",
  "plan.sending": "Sending…",
  "plan.save": "Save",
  "plan.subscribePay": "Subscribe & pay NT${price}/month",
  "plan.redirecting": "Going to payment…",
  "plan.completePay": "Complete payment NT${price}/month",
  "plan.updateTarget": "Update target price",
  "plan.resubscribePay": "Resubscribe NT${price}/month",
  "plan.cancelling": "Cancelling…",
  "plan.cancelSubscription": "Cancel subscription",
  "plan.resubscribe": "Resubscribe",
  "plan.cancel": "Cancel",

  "api.loadFailed": "Couldn't load subscriptions ({status})",
  "api.subscribeFailed": "Subscription failed ({status})",
  "api.cancelFailed": "Cancellation failed ({status})",

  "root.notFoundTitle": "Page not found",
  "root.notFoundBody": "The page you're looking for doesn't exist or has been moved.",
  "root.goHome": "Go home",
  "root.errorTitle": "This page didn't load",
  "root.errorBody": "Something went wrong on our end. You can try refreshing or head back home.",
  "root.tryAgain": "Try again",
};

const fr: Messages = {
  "lang.label": "Langue",
  "nav.signIn": "Se connecter",
  "nav.signOut": "Se déconnecter",

  "home.metaTitle": "Flight Price Notifier — Alertes de baisse de prix",
  "home.metaDescription":
    "Choisissez une ligne et un prix cible : nous vous écrivons dès que le tarif baisse.",
  "home.routes": "TPE → TOKYO · CDG · VIE",
  "home.tagline":
    "Choisissez une ligne et un prix cible : on vous prévient dès que le tarif baisse",
  "home.subtitle":
    "Les lignes populaires au départ de Taipei. Dès que le prix atteint votre cible, vous recevez un e-mail.",
  "home.cta": "Commencer gratuitement",
  "home.f1.title": "Surveillance continue",
  "home.f1.sub": "Les lignes populaires, 24 h/24",
  "home.f1.body":
    "Nous surveillons en continu les lignes populaires au départ de Taipei (Tokyo, Séoul) et repérons automatiquement les prix les plus bas.",
  "home.f2.title": "Alertes au prix cible",
  "home.f2.sub": "Prévenu dès la baisse",
  "home.f2.body":
    "Quand le tarif passe sous votre prix cible, nous vous envoyons un e-mail avec un lien pour réserver tout de suite.",
  "home.f3.title": "Sans engagement",
  "home.f3.sub": "Résiliable à tout moment",
  "home.f3.body": "Un abonnement mensuel que vous arrêtez quand vous voulez, sans engagement.",

  "auth.signInTitle": "Connexion",
  "auth.signUpTitle": "Créer un compte",
  "auth.signInSub": "Bon retour parmi nous.",
  "auth.signUpSub": "Commencez à suivre les tarifs au départ de Taipei.",
  "auth.signInMetaDescription": "Connectez-vous à Flight Price Notifier pour gérer vos alertes.",
  "auth.signUpMetaDescription":
    "Créez un compte Flight Price Notifier et recevez les baisses de prix par e-mail.",
  "auth.email": "E-mail",
  "auth.password": "Mot de passe",
  "auth.forgot": "Mot de passe oublié ?",
  "auth.submitSignIn": "Se connecter",
  "auth.submitSignUp": "S'inscrire",
  "auth.haveAccount": "Déjà un compte ?",
  "auth.noAccount": "Pas encore de compte ?",
  "auth.linkSignIn": "Se connecter",
  "auth.linkSignUp": "S'inscrire",
  "auth.wrongCredentials":
    "E-mail ou mot de passe incorrect. Utilisez « Mot de passe oublié ? » pour le réinitialiser.",
  "auth.checkEmail": "Consultez votre boîte mail pour confirmer votre compte.",
  "auth.or": "ou",
  "auth.google": "Continuer avec Google",
  "auth.facebook": "Continuer avec Facebook",
  "auth.providerUnavailable": "La connexion avec {provider} n'est pas encore disponible. Utilisez votre e-mail pour l'instant.",

  "password.forgotTitle": "Mot de passe oublié",
  "password.forgotSub":
    "Saisissez l'e-mail de votre compte : nous vous enverrons un lien de réinitialisation.",
  "password.forgotSent": "Consultez votre boîte mail : un lien de réinitialisation vous attend.",
  "password.sendLink": "Envoyer le lien",
  "password.backToSignIn": "Retour à la connexion",
  "password.resetTitle": "Nouveau mot de passe",
  "password.invalidLink": "Ce lien est invalide ou a expiré. Demandez-en un nouveau.",
  "password.newPassword": "Nouveau mot de passe",
  "password.save": "Enregistrer",
  "password.sendNewLink": "Renvoyer un lien",
  "password.updated": "Mot de passe mis à jour",

  "app.metaTitle": "Tableau de bord — Flight Price Notifier",
  "app.metaDescription": "Votre tableau de bord de suivi des lignes.",
  "app.greeting": "Bonjour {email}",
  "app.intro":
    "Choisissez une ligne et un prix cible ; nous vous écrirons quand le tarif passera en dessous.",
  "app.paySuccess":
    "Paiement effectué ! Les alertes commenceront dès l'activation de votre abonnement.",
  "app.payFailed":
    "Le paiement n'a pas abouti. Utilisez « Finaliser le paiement » sur la carte pour réessayer.",

  "plan.tokyo": "Taipei ✈ Tokyo",
  "plan.seoul": "Taipei ✈ Séoul",
  "plan.paris": "Taipei ✈ Paris",
  "plan.badge.active": "Abonné",
  "plan.badge.unpaid": "Paiement en attente",
  "plan.badge.grace": "Annulé",
  "plan.badge.ended": "Terminé",
  "plan.recentLow": "Prix bas récent : environ {price}",
  "plan.currentTarget": "Prix cible actuel : {price}",
  "plan.activeUntil": "Actif jusqu'au {end}, renouvelé chaque mois",
  "plan.graceUntil": "Actif jusqu'au {end} (alertes jusqu'à cette date, plus aucun prélèvement)",
  "plan.unpaidNote": "Les alertes commencent une fois le paiement effectué.",
  "plan.endedNote": "Cet abonnement est terminé. Payez à nouveau pour réactiver les alertes.",
  "plan.targetLabel": "Prix cible (TWD)",
  "plan.targetUpdated": "Prix cible mis à jour pour {plan}",
  "plan.cancelled":
    "Abonnement {plan} annulé. Vous recevrez des alertes jusqu'à la fin de la période payée.",
  "plan.invalidPrice": "Saisissez un prix cible valide (TWD)",
  "plan.confirmCancel":
    "Annuler votre abonnement {plan} ? Vous ne serez plus prélevé et recevrez des alertes jusqu'au {end}.",
  "plan.periodEnd": "la fin de la période en cours",
  "plan.sending": "Envoi…",
  "plan.save": "Enregistrer",
  "plan.subscribePay": "S'abonner et payer NT${price}/mois",
  "plan.redirecting": "Redirection vers le paiement…",
  "plan.completePay": "Finaliser le paiement NT${price}/mois",
  "plan.updateTarget": "Modifier le prix cible",
  "plan.resubscribePay": "Se réabonner NT${price}/mois",
  "plan.cancelling": "Annulation…",
  "plan.cancelSubscription": "Annuler l'abonnement",
  "plan.resubscribe": "Se réabonner",
  "plan.cancel": "Annuler",

  "api.loadFailed": "Impossible de charger les abonnements ({status})",
  "api.subscribeFailed": "Échec de l'abonnement ({status})",
  "api.cancelFailed": "Échec de l'annulation ({status})",

  "root.notFoundTitle": "Page introuvable",
  "root.notFoundBody": "La page que vous cherchez n'existe pas ou a été déplacée.",
  "root.goHome": "Accueil",
  "root.errorTitle": "Cette page ne s'est pas chargée",
  "root.errorBody": "Un problème est survenu de notre côté. Réessayez ou revenez à l'accueil.",
  "root.tryAgain": "Réessayer",
};

const MESSAGES: Record<Lang, Messages> = { zh, en, fr };
const STORAGE_KEY = "fpn-lang";

function isLang(value: unknown): value is Lang {
  return value === "zh" || value === "en" || value === "fr";
}

// Saved choice first, then the browser language, then Chinese (the site's original language).
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // Storage blocked: fall through to the browser language.
  }
  const nav = typeof navigator === "undefined" ? "" : navigator.language.toLowerCase();
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("en")) return "en";
  return "zh";
}

function applyHtmlLang(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = LANGUAGES.find((l) => l.code === lang)?.htmlLang ?? "zh-Hant";
}

let current: Lang = typeof window === "undefined" ? "zh" : detectLang();
applyHtmlLang(current);
const listeners = new Set<() => void>();

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang) {
  if (lang === current) return;
  current = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  applyHtmlLang(lang);
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, getLang);
}

type Vars = Record<string, string | number>;

function format(template: string, vars?: Vars) {
  return vars ? template.replace(/\{(\w+)\}/g, (m, k: string) => String(vars[k] ?? m)) : template;
}

// For non-React code (e.g. API error messages): uses the language selected right now.
export function translate(key: MessageKey, vars?: Vars): string {
  return format(MESSAGES[current][key], vars);
}

export function useT() {
  const lang = useLang();
  return useCallback((key: MessageKey, vars?: Vars) => format(MESSAGES[lang][key], vars), [lang]);
}
