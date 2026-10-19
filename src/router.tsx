import { createBrowserRouter, redirect, type RouteObject } from "react-router";
import { supabase } from "@/integrations/supabase/client";
import { ErrorComponent, NotFoundComponent, RootComponent } from "./routes/root";
import { Index } from "./routes/index";
import { SignIn } from "./routes/auth";
import { SignUp } from "./routes/signup";
import { AppPage } from "./routes/app";

// Client-only gate for signed-in pages: redirects to /auth when there is no user.
async function requireUser() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw redirect("/auth");
  return { user: data.user };
}

export const routes: RouteObject[] = [
  {
    element: <RootComponent />,
    errorElement: <ErrorComponent />,
    children: [
      { index: true, element: <Index /> },
      { path: "auth", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      {
        id: "authenticated",
        loader: requireUser,
        HydrateFallback: () => null,
        children: [{ path: "app", element: <AppPage /> }],
      },
      { path: "*", element: <NotFoundComponent /> },
    ],
  },
];

export const getRouter = () => createBrowserRouter(routes);
