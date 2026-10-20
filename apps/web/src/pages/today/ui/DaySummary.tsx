import { pluralize } from '@/shared/lib';

import s from './DaySummary.module.scss';

interface DaySummaryProps {
  done: number;
  total: number;
}

export const DaySummary = ({
  done,
  total,
}: DaySummaryProps) => {
  const remaining = total - done;
  const percent = total > 0 ? Math.round(done / total * 100) : 0;

  return (
    <div className={s.daySummary}>
      <div className={s.daySummaryCounter}>
        {done} of {total}
        <span className={s.daySummaryCounterText}>habits done</span>
      </div>
      <div className={s.daySummaryText}>
        <p className={s.daySummaryTitle}>You’re on a roll!</p>
        <p className={s.daySummaryParagraph}>
          {
            remaining > 0
              ? `Complete ${remaining} more ${pluralize(remaining, { one: 'habit', other: 'habits' })} to finish strong this day.`
              : 'You showed your strength on this day!'
          }
        </p>
        {/* oxlint-disable jsx-a11y/prefer-tag-over-role -- native <progress> can't animate value in Firefox */}
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
      </div>
    </div>
  );
};
