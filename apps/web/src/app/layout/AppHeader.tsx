import s from './AppHeader.module.scss';
import { usePageTitle } from './usePageTitle.ts';

export const AppHeader = () => {
  const pageTitle = usePageTitle();
  return (
    <div className={s.header}>
      <h1 className={s.title}>{pageTitle}</h1>
    </div>
  );
};
