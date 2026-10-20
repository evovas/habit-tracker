import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import { IconifyIcon } from '@/shared/ui';

import type { Habit } from '../model/habit.types.ts';
import s from './HabitItem.module.scss';

interface HabitItemProps {
  habit: Habit;
  compact?: boolean;
  children?: ReactNode;
  titleAs?: 'h2' | 'h3' | 'span';
}

export const HabitItem = ({
  habit,
  compact,
  children,
  titleAs: Title = 'span',
}: HabitItemProps) => {
  const Wrapper = Title === 'span' ? 'span' : 'div';
  return (
    <Wrapper className={s.habit}>
      <Wrapper className={s.icon}>
        <IconifyIcon name="hugeicons:badge-question-mark" size={21} />
      </Wrapper>
      <Wrapper className={s.info}>
        <Title className={clsx(s.name, compact && s.compact)}>
          {habit.name}
        </Title>
        <span className={s.paragraph}>
          {children}
        </span>
      </Wrapper>
    </Wrapper>
  );
};
