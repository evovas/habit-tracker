import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useId } from 'react';

import s from './UIVariantSelector.module.scss';

export interface VariantOption<V extends string | number> {
  label: ReactNode;
  value: V;
}

interface UIVariantSelectorProps<V extends string | number> {
  label: string;
  options: readonly VariantOption<V>[];
  value: V;
  onChange: (value: V) => void;
  disabled?: boolean;
  className?: string;
}

export const UIVariantSelector = <V extends string | number,>({
  label,
  options,
  value,
  onChange,
  disabled,
  className,
}: UIVariantSelectorProps<V>) => {
  const nameId = useId();
  return (
    <fieldset className={clsx(s.fieldset, className)} disabled={disabled}>
      <legend className={s.legend}>{label}</legend>
      <div className={s.options}>
        {options.map((option) => (
          <label
            key={option.value}
            className={s.option}
          >
            {option.label}
            <input
              name={nameId}
              type="radio"
              className={s.radio}
              value={option.value}
              checked={option.value === value}
              onChange={() => {
                onChange(option.value);
              }}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
};
