import { generatePath } from 'react-router';

export enum Route {
  TODAY = '/',
  WEEK = '/week',
  HABITS = '/habits',
  HABIT_DETAILS = '/habits/:habitId',
  STATISTICS = '/statistics',
  SETTINGS = '/settings',
}

export const routeUrl = {
  habitDetails: (habitId: string) =>
    generatePath(Route.HABIT_DETAILS, { habitId }),
};
