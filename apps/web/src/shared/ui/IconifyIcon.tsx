import { Icon } from '@iconify/react';

interface IconProps {
  name: string;
  size?: number;
}

export const IconifyIcon = ({ name, size = 19 }: IconProps) => (
  <Icon
    width={size}
    height={size}
    icon={name}
    aria-hidden
  />
);
