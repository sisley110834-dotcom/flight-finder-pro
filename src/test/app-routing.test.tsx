import { matchRoutes } from "react-router";
import { describe, expect, it, vi } from "vitest";

const { getUser } = vi.hoisted(() => ({ getUser: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: { getUser } } }));

import { routes } from "@/router";

// Match routes without running loaders or rendering: loaders need Supabase, which
// the test run lacks.
describe("App routing", () => {
  it.each(["/", "/auth", "/signup", "/forgot-password", "/reset-password", "/app"])(
    "matches a page for %s instead of falling back to not found",
    (path) => {
      const matches = matchRoutes(routes, path);

      expect(matches?.at(-1)?.route.path).not.toBe("*");
    },
  );

  it("falls back to not found for unknown paths", () => {
    expect(matchRoutes(routes, "/nope")?.at(-1)?.route.path).toBe("*");
  });

  it("redirects signed-out visitors away from /app to /auth", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    const gate = routes[0]?.children?.find((route) => route.id === "authenticated");
    if (typeof gate?.loader !== "function") throw new Error("Auth gate missing");
    const result = await Promise.resolve(gate.loader({ request: new Request("http://localhost/app"), params: {}, context: undefined }, undefined)).catch((error: Response) => error);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).headers.get("Location")).toBe("/auth");
  });

  it("allows signed-in visitors to reach /app with their own email", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "test-user", email: "user@example.com" } } });
    const gate = routes[0]?.children?.find((route) => route.id === "authenticated");
    if (typeof gate?.loader !== "function") throw new Error("Auth gate missing");
    const result = await gate.loader({ request: new Request("http://localhost/app"), params: {}, context: undefined }, undefined);
    expect(result).toEqual({ user: { id: "test-user", email: "user@example.com" } });
  });
});
