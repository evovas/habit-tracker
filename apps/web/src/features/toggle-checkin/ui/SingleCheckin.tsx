import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import type { Habit } from '@/entities/habit';

import { useToggleCheckin } from '../model/useToggleCheckin.ts';
import s from './SingleCheckin.module.scss';

interface SingleCheckinProps {
  checked: boolean;
  habitId: Habit['id'];
  date: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  children: (({ checked }: { checked: boolean }) => ReactNode) | ReactNode;
}

export const SingleCheckin = ({
  checked,
  habitId,
  date,
  className,
  disabled = false,
  ariaLabel,
  children,
}: SingleCheckinProps) => {
  const { toggle } = useToggleCheckin(habitId, date);

  const handleClick = () => {
    toggle({
      state: !checked,
    });
  };

  return (
    <button
      type="button"
      className={clsx(s.button, className)}
      onClick={handleClick}
      aria-pressed={checked}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {typeof children === 'function' ? children({ checked }) : children}
    </button>
  );
};
