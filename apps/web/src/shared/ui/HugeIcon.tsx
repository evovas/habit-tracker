import { HugeiconsIcon } from '@hugeicons/react';
import type { ComponentProps } from 'react';

type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, 'name'>;

export const HugeIcon = ({
  size = 19,
  color = 'currentColor',
  strokeWidth = 2,
  ...rest
}: IconProps) =>
  (
    <HugeiconsIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      aria-hidden
      {...rest}
    />
  );
