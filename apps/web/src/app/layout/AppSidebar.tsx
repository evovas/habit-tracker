import type { IconSvgObject } from '@hugeicons/core-free-icons/types';
import { NavLink } from 'react-router';

import { Route } from '@/shared/config';
import { HugeIcon, sidebarIcons } from '@/shared/ui';

import s from './AppSidebar.module.scss';
import logo from './logo.svg';
import logoTablet from './logo-tablet.svg';

interface AppSidebarProps {
  onNavigate: () => void;
}

interface MenuItem {
  text: string;
  route: Route;
  icon: IconSvgObject;
}

export const AppSidebar = ({ onNavigate }: AppSidebarProps) => {
  const menuItems: MenuItem[] = [
    {
      text: 'Today',
      route: Route.TODAY,
      icon: sidebarIcons.today,
    },
    {
      text: 'Week',
      route: Route.WEEK,
      icon: sidebarIcons.week,
    },
    {
      text: 'Habits',
      route: Route.HABITS,
      icon: sidebarIcons.habits,
    },
    {
      text: 'Statistics',
      route: Route.STATISTICS,
      icon: sidebarIcons.statistics,
    },
    {
      text: 'Settings',
      route: Route.SETTINGS,
      icon: sidebarIcons.settings,
    },
  ];

  return (
    <div className={s.sidebar}>
      <picture className={s.logo}>
        <source srcSet={logoTablet} media="(768px <= width <= 1280px)" width={36} height={36} />
        <img src={logo} alt="Daymark" width={128} height={34} />
      </picture>
      <nav className={s.navigation}>
        <ul className={s.navigationList}>
          {menuItems.map((item) => (
            <li key={item.route}>
              <NavLink
                to={{ pathname: item.route }}
                className={s.navigationItem}
                onClick={onNavigate}
              >
                <HugeIcon icon={item.icon} />
                <span className={s.navigationText}>{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
