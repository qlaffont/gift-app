import { Gift } from '@prisma/client';
import Link from 'next/link';
import { useMemo } from 'react';

import { useI18n } from '../../../i18n/useI18n';
import { Button } from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import { PriorityOptions } from './GiftFormModal';

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
  const { t, actualLang } = useI18n();

  const compareLink = useMemo(() => {
    if (actualLang === 'fr') {
      return `https://ledenicheur.fr/search?search=${encodeURIComponent(gift?.name)}`;
    }
    return `https://pricespy.co.uk/search?search=${encodeURIComponent(gift?.name)}`;
  }, [actualLang, gift]);

  return (
    <Modal isOpen={isOpen} title={gift?.name} onClose={onClose}>
      <div className="space-y-5">
        {onEdit && onDelete && (
          <div className="flex items-center justify-between">
            <div>
              <Button
                prefixIcon="icon icon-gift"
                variant={
                  gift?.priority === 3
                    ? 'error'
                    : gift?.priority === 2
                    ? 'warning'
                    : gift?.priority === 1
                    ? 'info'
                    : 'primary'
                }
                size="small"
              >
                {PriorityOptions(t).find((v) => v.value === gift?.priority)?.label}
              </Button>
            </div>

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
          </div>
        )}

        <div className="space-y-3">
          <p className="font-bold">{gift?.name}</p>

          <p>{gift?.description}</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          {gift?.link && (
            <div>
              <Link href={gift.link} target="_blank">
                <Button className="m-auto" prefixIcon="icon icon-card">
                  {t('components.modules.gift.buyIt')}
                </Button>
              </Link>
            </div>
          )}
          <div>
            <Link href={compareLink} target="_blank">
              <Button className="m-auto" prefixIcon="icon icon-chart" variant="info">
                {t('components.modules.gift.compare')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};
