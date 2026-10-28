import { clsx } from 'clsx';
import Skeleton from 'react-loading-skeleton';

import s from './HabitItem.module.scss';

interface HabitItemSkeletonProps {
  className?: string;
  compact?: boolean;
}

export const HabitItemSkeleton = ({
  className,
  compact,
}: HabitItemSkeletonProps) => (
  <span className={clsx(s.habit, className)}>
    <Skeleton containerClassName={s.icon} width="100%" height="100%" borderRadius={14} />
    <span className={s.info}>
      <Skeleton
        containerClassName={clsx(s.name, compact && s.compact, s.skeleton)}
        width="min(140px, 100%)"
      />
      <Skeleton
        containerClassName={clsx(s.paragraph, s.skeleton)}
        width="min(90px, 100%)"
      />
    </span>
  </span>
);
