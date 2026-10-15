import {
  Menu01Icon,
} from '@hugeicons/core-free-icons';

import { HugeIcon } from '@/shared/ui';

import s from './AppHeader.module.scss';
import { usePageTitle } from './usePageTitle.ts';

interface AppHeaderProps {
  onShowMenuClick: (state: boolean) => void;
}

export const AppHeader = ({ onShowMenuClick }: AppHeaderProps) => {
  const pageTitle = usePageTitle();
  return (
    <div className={s.header}>
      <button
        type="button"
        aria-label="Show menu"
        onClick={() => {
          onShowMenuClick(true);
        }}
        className={s.menuButton}
      >
        <HugeIcon icon={Menu01Icon} />
      </button>
      <h1 className={s.title}>{pageTitle}</h1>
    </div>
  );
};
