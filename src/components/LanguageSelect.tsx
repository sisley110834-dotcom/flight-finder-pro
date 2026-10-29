import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, setLang, useLang, useT, type Lang } from "@/lib/i18n";

// Dropdown that switches the whole UI between Chinese, English and French.
export function LanguageSelect() {
  const lang = useLang();
  const t = useT();
  return (
    <Select value={lang} onValueChange={(value) => setLang(value as Lang)}>
      <SelectTrigger
        aria-label={t("lang.label")}
        className="h-8 w-auto gap-1.5 rounded-full border-2 border-primary bg-card px-3 text-xs font-semibold text-primary"
      >
        <Globe className="size-3.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code} lang={l.htmlLang}>
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
