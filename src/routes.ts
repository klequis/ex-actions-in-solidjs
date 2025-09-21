import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import AboutData from './pages/about.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./pages/throwAllErrors')),
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: "/error01",
    component: lazy(() => import('./pages/error01'))
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
  {
    path: "/returnErrorInJson",
    component: lazy(() => import('./pages/errInJsonThrowUnexpected'))
  }
  
];
