import { useState } from 'react';

import { dayjs, formatToISODate, getISOStartOfWeek } from '@/shared/lib/date';
import { DateRangeSelector } from '@/shared/ui';

import s from './PageWeek.module.scss';
import { WeekHabits } from './WeekHabits.tsx';

export const PageWeek = () => {
  const today = formatToISODate(dayjs());
  const [firstDayOfActiveWeek, setFirstDayOfActiveWeek]
    = useState(() => getISOStartOfWeek(today));

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.text}>
          <h2 className={s.title}>Your week at a glance</h2>
          <p className={s.paragraph}>Check your list to see if you missed anything</p>
        </div>
        <DateRangeSelector
          type="week"
          maxDate={today}
          startDate={firstDayOfActiveWeek}
          onChange={setFirstDayOfActiveWeek}
        />
      </header>
      <WeekHabits weekStart={firstDayOfActiveWeek} today={today} />
    </div>
  );
};
