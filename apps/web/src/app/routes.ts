import type { RouteObject } from 'react-router';
import { replace } from 'react-router';

import { habitDetailsLoader, PageHabitDetails } from '@/pages/habit-details';
import { PageHabits } from '@/pages/habits';
import { PageToday } from '@/pages/today';
import { PageWeek } from '@/pages/week';
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
          title: () => `${getGreeting()}!`,
        },
      },
      {
        Component: PageWeek,
        path: Route.WEEK,
        handle: {
          title: 'Week',
        },
      },
      {
        Component: PageHabits,
        path: Route.HABITS,
        handle: {
          title: 'Habit list',
        },
      },
      {
        Component: PageHabitDetails,
        path: Route.HABIT_DETAILS,
        loader: habitDetailsLoader,
        handle: {
          title: 'Habit details',
        },
      },
    ],
  },
];
