import { authMenu, mainMenu, type AppRoute } from '../data/mockData';

const standaloneRoutes: AppRoute[] = ['/chat'];
const allRoutes = [...mainMenu, ...authMenu].map((item) => item.route).concat(standaloneRoutes);

export const authRoutes: AppRoute[] = ['/login', '/signup', '/password-reset'];

export function readRouteFromHash(): AppRoute {
  const hash = window.location.hash.replace('#', '') as AppRoute;
  return allRoutes.includes(hash) ? hash : '/dashboard';
}
