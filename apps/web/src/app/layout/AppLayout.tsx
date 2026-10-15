import { Outlet } from 'react-router';

import { AppHeader } from './AppHeader.tsx';
import s from './AppLayout.module.scss';
import { AppSidebar } from './AppSidebar.tsx';

export const AppLayout = () => (
  <div className={s.app}>
    <header className={s.appHeader}>
      <AppHeader />
    </header>
    <div className={s.appSidebar}>
      <AppSidebar />
    </div>
    <main className={s.appMain}>
      <Outlet />
    </main>
  </div>
);
