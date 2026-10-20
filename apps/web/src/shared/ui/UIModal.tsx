import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';

import { HugeIcon } from './HugeIcon.tsx';
import { icons } from './icons.ts';
import s from './UIModal.module.scss';

interface UIModalProps {
  closable?: boolean;
  open: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
}

export const UIModal = ({
  closable = true,
  open,
  onClose,
  title,
  description,
  children,
}: UIModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  /* eslint-disable react-you-might-not-need-an-effect/no-event-handler -- syncs `open` prop with native <dialog> API */
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);
  /* eslint-enable react-you-might-not-need-an-effect/no-event-handler */

  return (
    <dialog
      ref={ref}
      className={s.modal}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onKeyDown={(e) => {
        if (!closable && e.key === 'Escape') {
          e.preventDefault();
        }
      }}
    >
      {
        open && (
          <>
            <div className={s.header}>
              <div className={s.textWrapper}>
                {title && <h2 id={titleId} className={s.title}>{title}</h2>}
                {description && <p id={descriptionId} className={s.description}>{description}</p>}
              </div>
              {closable
                && (
                  <button
                    type="button"
                    aria-label="Close modal"
                    className={s.closeButton}
                    onClick={() => {
                      ref.current?.close();
                    }}
                  >
                    <HugeIcon icon={icons.close} />
                  </button>
                )}
            </div>
            {Boolean(children) && (
              <div className={s.content}>
                {children}
              </div>
            )}
          </>
        )
      }
    </dialog>
  );
};
