import { describe, expect, it } from "vitest";

import { getLang, setLang, translate } from "@/lib/i18n";

describe("i18n", () => {
  it("switches every message to the chosen language and remembers it", () => {
    setLang("fr");
    expect(getLang()).toBe("fr");
    expect(translate("nav.signIn")).toBe("Se connecter");
    expect(document.documentElement.lang).toBe("fr");
    expect(localStorage.getItem("fpn-lang")).toBe("fr");

    setLang("zh");
    expect(translate("nav.signIn")).toBe("登入");
    expect(translate("plan.recentLow", { price: "NT$9,325" })).toBe("最近最低價約 NT$9,325");

    setLang("en");
    expect(translate("api.loadFailed", { status: 500 })).toBe("Couldn't load subscriptions (500)");
  });
});
