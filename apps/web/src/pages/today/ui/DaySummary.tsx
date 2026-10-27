import { clsx } from 'clsx';
import Skeleton from 'react-loading-skeleton';

import { pluralize } from '@/shared/lib';
import { HugeIcon, icons, UICard } from '@/shared/ui';

import s from './DaySummary.module.scss';

interface DaySummaryProps {
  done: number;
  total: number;
  loading: boolean;
  error: boolean;
}

export const DaySummary = ({
  done,
  total,
  loading,
  error,
}: DaySummaryProps) => {
  const remaining = total - done;
  const percent = total > 0 ? Math.round(done / total * 100) : 0;

  return (
    <UICard className={s.daySummary}>
      <div className={clsx(s.daySummaryCounter, error && s.error)}>
        {loading && (
          <Skeleton
            width={50}
          />
        )}
        {!error && (
          <>
            {!loading && <span>{done} of {total}</span>}
            <span className={s.daySummaryCounterText}>habits done</span>
          </>
        )}
        {error && (
          <HugeIcon
            icon={icons.sad}
            size={40}
          />
        )}

      </div>
      <div className={s.daySummaryText}>
        {error && <p className={s.daySummaryTitle}>Oops! We couldn’t load the list of check-ins...</p>}
        {!error && <p className={s.daySummaryTitle}>You’re on a roll!</p>}
        {loading && (
          <Skeleton
            containerClassName={s.daySummaryParagraph}
            width={250}
          />
        )}
        {!loading && !error && (
          <p className={s.daySummaryParagraph}>
            {
              remaining > 0
                ? `Complete ${remaining} more ${pluralize(remaining, { one: 'habit', other: 'habits' })} to finish strong this day.`
                : 'You showed your strength on this day!'
            }
          </p>
        )}
        {loading && (
          <Skeleton
            containerClassName={s.daySummaryProgressBarWrapper}
            width="100%"
          />
        )}
        {/* oxlint-disable jsx-a11y/prefer-tag-over-role -- native <progress> can't animate value in Firefox */}
        {!loading && !error && (
          <div
            role="progressbar"
            aria-label="Habits done"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className={s.daySummaryProgressBarWrapper}
          >
            {/* oxlint-enable jsx-a11y/prefer-tag-over-role */}
            <div
              className={s.daySummaryProgressBar}
              style={{ transform: `translateX(${percent - 100}%)` }}
            />
          </div>
        )}
      </div>
    </UICard>
  );
};
