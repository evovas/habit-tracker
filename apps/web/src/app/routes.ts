import type { RouteObject } from 'react-router';
import { replace } from 'react-router';

import { PageToday } from '@/pages/today';
import { Route } from '@/shared/config';
import { getGreeting } from '@/shared/lib/date';

import { AppLayout } from './layout/AppLayout.tsx';

export const routes: RouteObject[] = [
  {
    path: '*',
    loader: () => replace(Route.TODAY),
  },
  {
    Component: AppLayout,
    children: [
      {
        Component: PageToday,
        path: Route.TODAY,
        handle: {
          title: () => `${getGreeting()}, username`,
        },
      },
    ],
  },
];
