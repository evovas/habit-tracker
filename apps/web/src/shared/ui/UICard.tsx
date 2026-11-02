import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import s from './UICard.module.scss';

interface UICardProps {
  children: ReactNode;
  shadowOnHover?: boolean;
  as?: 'div' | 'span';
  title?: string;
  description?: string;
  details?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export const UICard = ({
  children,
  shadowOnHover = true,
  as: Wrapper = 'div',
  title,
  description,
  details,
  className,
  containerClassName,
}: UICardProps) => {
  const hasHeader = Boolean(title) || Boolean(description) || Boolean(details);
  const Header = Wrapper === 'div' ? 'header' : 'span';
  const Title = Wrapper === 'div' ? 'h3' : 'span';
  const Paragraph = Wrapper === 'div' ? 'p' : 'span';
  const Details = Wrapper === 'div' ? 'div' : 'span';
  return (
    <Wrapper
      className={clsx(
        s.card,
        shadowOnHover && s.withShadow,
        containerClassName,
      )}
    >
      {hasHeader && (
        <Header>
          {title && <Title>{title}</Title>}
          {description && <Paragraph>{description}</Paragraph>}
          {Boolean(details) && <Details>{details}</Details>}
        </Header>
      )}
      <Wrapper className={clsx(s.content, className)}>
        {children}
      </Wrapper>
    </Wrapper>
  );
};
