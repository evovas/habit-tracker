import { UIButton } from '@/shared/ui';

import s from './AppHeader.module.scss';
import { usePageTitle } from './usePageTitle.ts';

interface AppHeaderProps {
  onShowMenuClick: () => void;
}

export const AppHeader = ({ onShowMenuClick }: AppHeaderProps) => {
  const pageTitle = usePageTitle();
  return (
    <div className={s.header}>
      <UIButton
        text="Show menu"
        variant="secondary"
        icon="menu"
        iconOnly
        className={s.menuButton}
        onClick={onShowMenuClick}
      />
      <h1 className={s.title}>{pageTitle}</h1>
    </div>
  );
};
