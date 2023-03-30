import { Gift } from '@prisma/client';

import { useI18n } from '../../../i18n/useI18n';
import { Button } from '../../atoms/Button';
import Modal from '../../atoms/Modal';

export const GiftModal = ({
  gift,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: {
  gift: Partial<Gift>;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} title={gift?.name} onClose={onClose}>
      <div className="space-y-5">
        {onEdit && onDelete && (
          <div className="flex items-center justify-end gap-1">
            <div>
              <Button
                prefixIcon="icon icon-pen"
                variant="warning"
                size="small"
                onClick={() => {
                  onEdit();
                }}
              >
                {t('components.modules.gift.editBtn')}
              </Button>
            </div>
            <div>
              <Button
                prefixIcon="icon icon-trash"
                variant="error"
                size="small"
                onClick={() => {
                  onDelete();
                }}
              >
                {t('components.modules.gift.deleteBtn')}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="font-bold">{gift?.name}</p>

          <p>{gift?.description}</p>
        </div>

        <div>
          <Button className="m-auto">buy</Button>
        </div>
      </div>
    </Modal>
  );
};
