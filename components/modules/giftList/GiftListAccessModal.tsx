import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useI18n } from '../../../i18n/useI18n';
import { useCreateGiftListAccessMutation } from '../../../services/apis/react-query/mutations/useCreateGiftListAccessMutation';
import { useDeleteGiftListAccessMutation } from '../../../services/apis/react-query/mutations/useDeleteGiftListAccessMutation';
import { useFindGiftListAccessByIdQuery } from '../../../services/apis/react-query/queries/useFindGiftListAccessByIdQuery';
import { useInvalidateQueries } from '../../../services/apis/react-query/useInvalidateQueries';
import { GiftList } from '../../../services/types/prisma.type';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import Modal from '../../atoms/Modal';

export const GiftListAccessModal = ({
  giftList,
  isOpen,
  onClose,
}: {
  giftList?: Partial<GiftList>;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useI18n();
  const invalidateQueries = useInvalidateQueries();
  const { mutateAsync: createAccess, isLoading: isLoadingCreate } = useCreateGiftListAccessMutation();
  const { mutateAsync: deleteAccess, isLoading: isLoadingDelete } = useDeleteGiftListAccessMutation();
  const { data, isLoading: isLoadingData } = useFindGiftListAccessByIdQuery(
    {
      id: giftList?.id,
      userId: giftList?.ownerId,
    },
    {
      enabled: !!giftList?.id && isOpen,
    },
  );

  const isLoading = useMemo(
    () => isLoadingCreate || isLoadingData || isLoadingDelete,
    [isLoadingCreate, isLoadingData, isLoadingDelete],
  );

  const [email, setEmail] = useState<string>();

  const onSubmit = useCallback(async () => {
    try {
      await createAccess({
        giftListId: giftList?.id,
        userId: giftList?.ownerId,
        email,
      });
      await invalidateQueries([
        'findGiftListAccessById',
        {
          userId: giftList?.ownerId,
          id: giftList?.id,
        },
      ]);
      setEmail('');
      toast.success(t('components.atoms.alert.changesSaved'));
    } catch (error) {
      toast.error(t('components.atoms.alert.errorTryLater'));
    }
  }, [email]);

  const onDelete = useCallback(
    async (email: string) => {
      try {
        await deleteAccess({
          giftListId: giftList?.id,
          userId: giftList?.ownerId,
          email,
        });
        await invalidateQueries([
          'findGiftListAccessById',
          {
            userId: giftList?.ownerId,
            id: giftList?.id,
          },
        ]);
        toast.success(t('components.atoms.alert.changesSaved'));
      } catch (error) {
        toast.error(t('components.atoms.alert.errorTryLater'));
      }
    },
    [email],
  );

  return (
    <Modal
      isOpen={isOpen}
      title={giftList?.id ? t('pages.profile.giftList.edit') : t('pages.profile.giftList.add')}
      onClose={onClose}
    >
      <div className="space-y-3">
        <div>
          <Input
            label={t('components.modules.giftListAccess.email')}
            value={email}
            onChange={(evt) => setEmail(evt?.target?.value)}
          />
        </div>
        <div>
          <Button className="m-auto" isLoading={isLoading} onClick={() => onSubmit()}>
            {t('components.form.save')}
          </Button>
        </div>
      </div>

      {data?.length > 0 && (
        <>
          <div className="my-3 border-b"></div>

          <div className="space-y-3">
            {data?.map((email) => (
              <div className="flex items-center justify-between" key={email}>
                <div>{email}</div>
                <div>
                  <Button
                    prefixIcon="icon icon-trash !h-4 !w-4 ml-1 md:!m-0 my-1 md:!h-3 md:!w-3"
                    variant="error"
                    size="small"
                    onClick={() => {
                      onDelete(email);
                    }}
                  >
                    <span className="hidden md:block">{t('components.form.delete')}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
};
