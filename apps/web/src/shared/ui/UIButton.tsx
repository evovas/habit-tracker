import { clsx } from 'clsx';
import { Link } from 'react-router';

import type { Route } from '../config';
import { HugeIcon } from './HugeIcon.tsx';
import type { IconName } from './icons.ts';
import { icons } from './icons.ts';
import s from './UIButton.module.scss';

interface UIButtonBaseProps {
  text: string;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'warning' | 'ghost';
  iconOnly?: boolean;
  className?: string;
}

interface UIButtonButtonProps extends UIButtonBaseProps {
  renderAs?: 'button';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

interface UIButtonLinkProps extends UIButtonBaseProps {
  renderAs: 'link';
  href: string;
}

interface UIButtonRouterLinkProps extends UIButtonBaseProps {
  renderAs: 'router-link';
  to: Route;
}

type UIButtonProps
  = UIButtonButtonProps
    | UIButtonLinkProps
    | UIButtonRouterLinkProps;

export const UIButton = (props: UIButtonProps) => {
  const {
    text,
    icon,
    variant = 'primary',
    className,
    iconOnly,
  } = props;
  const classes = clsx(s.button, s[variant], className, iconOnly && s.iconOnly);
  const ariaLabel = iconOnly ? text : undefined;
  const content = (
    <>
      {icon && <HugeIcon size={17} icon={icons[icon]} />}
      {iconOnly ? null : text}
    </>
  );
  if (props.renderAs === 'link') {
    return (
      <a
        className={classes}
        aria-label={ariaLabel}
        href={props.href}
      >
        {content}
      </a>
    );
  }
  if (props.renderAs === 'router-link') {
    return (
      <Link
        className={classes}
        to={props.to}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      className={classes}
      aria-label={ariaLabel}
      onClick={props.onClick}
      type={props.type === 'submit' ? 'submit' : 'button'}
      disabled={props.disabled}
    >
      {content}
    </button>
  );
};
