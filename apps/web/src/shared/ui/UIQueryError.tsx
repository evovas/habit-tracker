import { clsx } from 'clsx';

import type { AppError } from '../api/error-handler.ts';
import { getUserErrorMessage } from '../api/error-handler.ts';
import { HugeIcon } from '../ui/HugeIcon.tsx';
import { icons } from '../ui/icons.ts';
import s from './UIQueryError.module.scss';

interface UIQueryErrorProps {
  error: AppError;
  vocabulary: Partial<Record<string, string>>;
  actionRetryButton?: string;
  onRetryAction: () => void;
  variant?: 'row' | 'column';
  className?: string;
}

export const UIQueryError = ({
  error,
  vocabulary,
  actionRetryButton = 'Retry',
  onRetryAction,
  variant = 'row',
  className,
}: UIQueryErrorProps) => (
  <div
    role="alert"
    className={clsx(
      s.errorWrapper,
      variant === 'row' ? s.row : s.column,
      className,
    )}
  >
    <HugeIcon icon={icons.alert} />
    <span className={s.errorText}>
      {getUserErrorMessage(vocabulary, error)}
    </span>
    <button
      type="button"
      className={s.errorRetryButton}
      onClick={onRetryAction}
    >
      {actionRetryButton === 'Retry' && <HugeIcon icon={icons.retry} size={12} />}
      { actionRetryButton }
    </button>
  </div>
);
