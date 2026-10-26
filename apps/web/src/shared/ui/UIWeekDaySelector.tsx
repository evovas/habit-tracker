import { useId } from 'react';

import { WEEK_DAYS } from '../lib/date';
import s from './UIWeekDaySelector.module.scss';

interface UIWeekDaySelectorProps {
  label: string;
  name: string;
  value: number[];
  disabled?: boolean;
  errors?: string[];
  onChange: (value: number[]) => void;
}

export const UIWeekDaySelector = ({
  label,
  name,
  value,
  disabled,
  errors,
  onChange,
}: UIWeekDaySelectorProps) => {
  const handleChange = (day: number) => {
    if (value.includes(day)) {
      onChange(value.filter((v) => v !== day));
    } else {
      onChange([...value, day].toSorted((a, b) => a - b));
    }
  };

  const errorId = useId();

  return (
    <>
      <fieldset
        aria-invalid={Boolean(errors?.length)}
        aria-describedby={errorId}
        className={s.fieldset}
        disabled={disabled}
      >
        <legend className={s.legend}>{label}</legend>
        <div className={s.options}>
          {WEEK_DAYS.map((day) => (
            <label key={day.num} className={s.option}>
              {day.shortName}
              <input
                type="checkbox"
                className={s.input}
                name={name}
                value={day.num}
                aria-label={day.longName}
                checked={value.includes(day.num)}
                onChange={() => {
                  handleChange(day.num);
                }}
              />
            </label>
          ))}
        </div>
      </fieldset>
      {Boolean(errors?.length) && (
        <span>
          <span className={s.errorsWrapper}>
            {errors?.map((error) => <span key={error}>{error}</span>)}
          </span>
        </span>
      )}
    </>
  );
};
