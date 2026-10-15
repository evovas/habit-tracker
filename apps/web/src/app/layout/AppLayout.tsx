import { useClickOutside } from '@reactuses/core/useClickOutside';
import { clsx } from 'clsx';
import { useRef, useState } from 'react';
import { Outlet } from 'react-router';

import { AppHeader } from './AppHeader.tsx';
import s from './AppLayout.module.scss';
import { AppSidebar } from './AppSidebar.tsx';

export const AppLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => {
    setIsMenuOpen(false);
  });
  return (
    <div className={s.app}>
      <header className={s.appHeader}>
        <AppHeader
          onShowMenuClick={setIsMenuOpen}
        />
      </header>
      <div
        ref={menuRef}
        className={clsx(
          s.appSidebar,
          isMenuOpen && s.appSidebarOpen,
        )}
      >
        <AppSidebar
          onNavigate={setIsMenuOpen}
        />
      </div>
      <main className={s.appMain}>
        <Outlet />
      </main>
    </div>
  );
};
