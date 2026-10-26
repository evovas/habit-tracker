import { useMatches } from 'react-router';

interface RouteHandle {
  title: string | (() => string);
}

const isRouteHandle = (handle: unknown): handle is RouteHandle =>
  typeof handle === 'object'
  && handle !== null
  && 'title' in handle
  && (typeof handle.title === 'string'
    || (
      typeof handle.title === 'function'
      && typeof (handle.title as () => unknown)() === 'string'
    )
  );

export const usePageTitle = (): string | undefined => {
  const matches = useMatches();
  const match = matches.findLast(
    (m) => isRouteHandle(m.handle),
  );

  if (match && isRouteHandle(match.handle)) {
    if (typeof match.handle.title === 'function') {
      return match.handle.title();
    }
    return match.handle.title;
  }
  return undefined;
};
