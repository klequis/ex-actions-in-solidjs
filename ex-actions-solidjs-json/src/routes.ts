import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("./pages/(errInJson)")),
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
