import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import { useCheckinsMockStore } from '@/entities/checkin';
import type { Habit } from '@/entities/habit';

import s from './SingleCheckin.module.scss';

interface SingleCheckinProps {
  checked: boolean;
  habitId: Habit['id'];
  date: string;
  className?: string;
  children: ({ checked }: { checked: boolean }) => ReactNode;
}

export const SingleCheckin = ({
  checked,
  habitId,
  date,
  className,
  children,
}: SingleCheckinProps) => {
  const createCheckin = useCheckinsMockStore((state) => state.create);
  const deleteCheckin = useCheckinsMockStore((state) => state.delete);
  const handleClick = () => {
    if (checked) {
      deleteCheckin(habitId, date);
    } else {
      createCheckin(habitId, date);
    }
  };
  return (
    <button
      type="button"
      className={clsx(s.button, className)}
      onClick={handleClick}
      aria-pressed={checked}
    >
      {children({ checked })}
    </button>
  );
};
