import { clsx } from 'clsx';
import type { ComponentProps } from 'react';
import { useId } from 'react';

import { HugeIcon } from './HugeIcon.tsx';
import type { IconName } from './icons.ts';
import { icons } from './icons.ts';
import s from './UITextInput.module.scss';

interface UITextInputProps
  extends Omit<ComponentProps<'input'>, 'type' | 'onChange' | 'value'> {
  type?: 'text' | 'number';
  icon?: IconName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  className?: string;
}

export const UITextInput = ({
  type = 'text',
  icon,
  label,
  value,
  onChange,
  errors,
  className,
  ...rest
}: UITextInputProps) => {
  const errorId = useId();
  return (
    <label className={clsx(s.root, className)}>
      <span className={s.label}>{label}</span>
      <span
        className={s.inputWrapper}
      >
        {icon
          && (
            <span className={s.icon}>
              <HugeIcon icon={icons[icon]} />
            </span>
          )}
        <input
          type="text"
          inputMode={type === 'number' ? 'numeric' : 'text'}
          pattern={type === 'number' ? '[0-9]*' : undefined}
          className={s.input}
          aria-invalid={Boolean(errors?.length)}
          aria-describedby={errorId}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          {...rest}
        />
      </span>
      {Boolean(errors?.length) && (
        <span id={errorId}>
          <span className={s.errorsWrapper}>
            {errors?.map((error) => <span key={error}>{error}</span>)}
          </span>
        </span>
      )}
    </label>
  );
};
