import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import s from './UICard.module.scss';

interface UICardProps {
  children: ReactNode;
  shadowOnHover?: boolean;
  as?: 'div' | 'span';
  className?: string;
}

export const UICard = ({
  children,
  shadowOnHover = true,
  as: Wrapper = 'div',
  className,
}: UICardProps) => (
  <Wrapper
    className={clsx(
      s.card,
      shadowOnHover && s.withShadow,
      className,
    )}
  >
    {children}
  </Wrapper>
);
