import { useClickOutside } from '@reactuses/core/useClickOutside';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
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
  useEffect(() => {
    const handlePressButton = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handlePressButton);

    return () => {
      document.removeEventListener('keydown', handlePressButton);
    };
  }, []);
  return (
    <div className={s.app}>
      <header className={s.appHeader}>
        <AppHeader
          onShowMenuClick={() => {
            setIsMenuOpen(true);
          }}
        />
      </header>
      <div
        className={
          clsx(
            s.appSidebarBackdrop,
            isMenuOpen && s.appSidebarOpen,
          )
        }
      >
        <div
          ref={menuRef}
          className={
            clsx(
              s.appSidebar,
              isMenuOpen && s.appSidebarOpen,
            )
          }
        >
          <AppSidebar
            onNavigate={() => {
              setIsMenuOpen(false);
            }}
          />
        </div>
      </div>
      <main className={s.appMain}>
        <Outlet />
      </main>
    </div>
  );
};
