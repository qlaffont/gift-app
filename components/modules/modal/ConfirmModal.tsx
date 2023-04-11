import { useI18n } from '../../../i18n/useI18n';
import { Button } from '../../atoms/Button';
import Modal from '../../atoms/Modal';

export const ConfirmModal = ({
  title,
  description,
  actionLabel,
  isOpen,
  isLoading,
  onClose,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onAction: () => void;
}) => {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm italic">{description}</p>
      </div>

      <div className="mt-5 flex items-center justify-center gap-1">
        <div>
          <Button className="m-auto" isLoading={isLoading} onClick={() => onClose()}>
            {t('components.form.cancel')}
          </Button>
        </div>
        <div>
          <Button
            className="m-auto"
            isLoading={isLoading}
            onClick={async () => {
              await onAction();
              onClose();
            }}
            variant="error"
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
