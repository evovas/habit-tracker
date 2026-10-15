import { HugeiconsIcon } from '@hugeicons/react';
import type { ComponentProps } from 'react';

type IconProps = ComponentProps<typeof HugeiconsIcon>;

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
      {...rest}
    />
  );
