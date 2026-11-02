import { UIButton } from './UIButton.tsx';
import s from './UIConfirmationModal.module.scss';
import { UIModal } from './UIModal.tsx';

interface UIConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  pending?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  variant?: 'primary' | 'warning';
}

export const UIConfirmationModal = ({
  open,
  title,
  description,
  pending,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  onCancel,
  onConfirm,
  variant,
}: UIConfirmationModalProps) => (
  <UIModal
    closable={!pending}
    open={open}
    title={title}
    description={description}
    onClose={onCancel}
  >
    <div className={s.buttons}>
      <UIButton
        text={cancelButtonText}
        variant="secondary"
        disabled={pending}
        onClick={onCancel}
      />
      <UIButton
        text={confirmButtonText}
        variant={variant}
        disabled={pending}
        onClick={onConfirm}
      />
    </div>
  </UIModal>
);
