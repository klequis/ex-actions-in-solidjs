import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import AboutData from './pages/about.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./pages/home')),
  },
  {
    path: '/throwAllErrors',
    component: lazy(() => import('./pages/throwAllErrors')),
  },
  {
    path: "/errInJsonThrowUnexpected",
    component: lazy(() => import('./pages/errInJsonThrowUnexpected'))
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
  
  
];
