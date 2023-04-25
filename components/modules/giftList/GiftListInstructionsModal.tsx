import Lottie from 'lottie-react';

import { useI18n } from '../../../i18n/useI18n';
import LottieGiftInformations from '../../../public/lottie/gift-informations.json';
import LottieGiftPriority from '../../../public/lottie/gift-priority.json';
import LottieGiftTaken from '../../../public/lottie/gift-taken.json';
import { useUser } from '../../../services/useUser';
import { Button } from '../../atoms/Button';
import Modal from '../../atoms/Modal';

export const GiftListInstructionsModal = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const user = useUser();
  return (
    <Modal isOpen={isOpen} title={t('pages.profile.instructions.title')} onClose={onClose}>
      <div className="space-y-6">
        {!user && (
          <p className="rounded-lg bg-info px-2 py-1 text-center font-bold text-white">
            {t('pages.profile.instructions.isConnected')}
          </p>
        )}

        <div className="flex items-center gap-3">
          <div>
            <Lottie loop={true} animationData={LottieGiftPriority} className="h-24 w-24" />
          </div>
          <div>
            <p>{t('pages.profile.instructions.priority')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <Lottie loop={true} animationData={LottieGiftInformations} className="h-24 w-24" />
          </div>
          <div>
            <p>{t('pages.profile.instructions.compare')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <Lottie loop={true} animationData={LottieGiftTaken} className="h-24 w-24" />
          </div>
          <div>
            <p className="text-center font-bold">{t('pages.profile.instructions.taken')}</p>
          </div>
        </div>

        <div className="w-full">
          <Button
            variant="success"
            className="m-auto animate-pulse"
            onClick={() => {
              onClose();
            }}
          >
            {t('pages.profile.instructions.understand')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
