import { useMatches } from 'react-router';

interface RouteHandle {
  title: string;
}

const isRouteHandle = (handle: unknown): handle is RouteHandle =>
  typeof handle === 'object'
  && handle !== null
  && 'title' in handle
  && typeof handle.title === 'string';

export const usePageTitle = (): string | undefined => {
  const matches = useMatches();
  const match = matches.findLast(
    (m) => isRouteHandle(m.handle),
  );

  if (match && isRouteHandle(match.handle)) {
    return match.handle.title;
  }
  return undefined;
};
