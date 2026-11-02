import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { useEffect, useId, useState } from 'react';

import { HugeIcon } from './HugeIcon.tsx';
import { icons } from './icons.ts';
import s from './UIModal.module.scss';

interface ModalApi {
  close: () => void;
}

interface UIModalProps {
  closable?: boolean;
  open: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children?: ReactNode | ((modal: ModalApi) => ReactNode);
  containerClassName?: string;
  className?: string;
}

export const UIModal = ({
  closable = true,
  open,
  onClose,
  title,
  description,
  children,
  containerClassName,
  className,
}: UIModalProps) => {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  /* eslint-disable react-you-might-not-need-an-effect/no-event-handler -- syncs `open` prop with native <dialog> API */
  useEffect(() => {
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, dialog]);
  /* eslint-enable react-you-might-not-need-an-effect/no-event-handler */

  const close = () => {
    dialog?.close();
  };

  const content = typeof children === 'function'
    ? children({ close })
    : children;

  return (
    <dialog
      ref={setDialog}
      className={clsx(s.modal, containerClassName)}
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
          <div className={clsx(s.modalContent, className)}>
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
                      dialog?.close();
                    }}
                  >
                    <HugeIcon icon={icons.close} />
                  </button>
                )}
            </div>
            {Boolean(children) && (
              <div className={s.content}>
                {content}
              </div>
            )}
          </div>
        )
      }
    </dialog>
  );
};
