import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("./pages/home")),
  },
  {
    path: "/throwAllErrors",
    component: lazy(() => import("./pages/throwAllErrors")),
  },
  {
    path: "/errInJSON",
    component: lazy(() => import("./pages/errInJSON")),
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
