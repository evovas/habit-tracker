import {
  CalendarCheckIcon,
  CalendarCheckOut02Icon,
  ChartAnalysisIcon,
  CheckListIcon,
  Settings01Icon,
} from '@hugeicons/core-free-icons';
import { NavLink } from 'react-router';

import { Route } from '@/shared/config';
import { HugeIcon } from '@/shared/ui';

import s from './AppSidebar.module.scss';
import logo from './logo.svg';
import logoTablet from './logo-tablet.svg';

export const AppSidebar = () => (
  <div className={s.sidebar}>
    <picture className={s.logo}>
      <source srcSet={logoTablet} media="(768px <= width <= 1280px)" width={36} height={36} />
      <img src={logo} alt="Daymark" width={128} height={34} />
    </picture>
    <nav className={s.navigation}>
      <ul className={s.navigationList}>
        <li>
          <NavLink to={{ pathname: Route.TODAY }} className={s.navigationItem}>
            <HugeIcon icon={CalendarCheckIcon} />
            <span className={s.navigationText}>Today</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={{ pathname: Route.WEEK }} className={s.navigationItem}>
            <HugeIcon icon={CalendarCheckOut02Icon} />
            <span className={s.navigationText}>Week</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={{ pathname: Route.HABITS }} className={s.navigationItem}>
            <HugeIcon icon={CheckListIcon} />
            <span className={s.navigationText}>Habits</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={{ pathname: Route.STATISTICS }} className={s.navigationItem}>
            <HugeIcon icon={ChartAnalysisIcon} />
            <span className={s.navigationText}>Statistics</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={{ pathname: Route.SETTINGS }} className={s.navigationItem}>
            <HugeIcon icon={Settings01Icon} />
            <span className={s.navigationText}>Settings</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  </div>
);
