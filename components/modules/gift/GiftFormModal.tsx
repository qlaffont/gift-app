import { yupResolver } from '@hookform/resolvers/yup';
import { Gift } from '@prisma/client';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useBoolean } from 'usehooks-ts';

import { useI18n } from '../../../i18n/useI18n';
import { useCreateGiftMutation } from '../../../services/apis/react-query/mutations/useCreateGiftMutation';
import { useUpdateGiftMutation } from '../../../services/apis/react-query/mutations/useUpdateGiftMutation';
import { useInvalidateQueries } from '../../../services/apis/react-query/useInvalidateQueries';
import { setValuesReactHookForm } from '../../../services/setValuesReactHookForm';
import { useYup } from '../../../services/useYup';
import { Button } from '../../atoms/Button';
import { FormDevTools } from '../../atoms/FormDevTool';
import { Input } from '../../atoms/Input';
import Modal from '../../atoms/Modal';

export const GiftFormModal = ({
  gift,
  isOpen,
  onClose,
  giftListId,
}: {
  gift?: Partial<Gift>;
  isOpen: boolean;
  onClose: () => void;
  giftListId: string;
}) => {
  const { t } = useI18n();
  const yup = useYup();
  const invalidateQueries = useInvalidateQueries();
  const router = useRouter();
  const { mutateAsync: createGift } = useCreateGiftMutation();
  const { mutateAsync: updateGift } = useUpdateGiftMutation();
  const { value: isLoading, setValue: setIsLoading } = useBoolean();

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(),
        description: yup.string().optional().nullable(),
        link: yup.string().optional().nullable(),
        coverUrl: yup.string().optional().nullable(),
      }),
    [yup],
  );
  const {
    register,
    control,
    getValues,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = getValues();

      if (gift) {
        await updateGift({
          ...data,
          id: gift?.id,
          giftListId,
          userId: router.query.id as string,
        });
        await invalidateQueries([
          'findGiftListById',
          {
            userId: router.query.username,
            id: giftListId,
          },
        ]);
        onClose();
      } else {
        await createGift({
          ...data,
          giftListId,
          userId: router.query.id as string,
        });
      }
      await invalidateQueries(['findUserById', { id: router.query.id }]);
      onClose();
      toast.success(t('components.atoms.alert.changesSaved'));
    } catch (error) {
      setIsLoading(false);
      toast.error(t('components.atoms.alert.errorTryLater'));
    }
  }, [router, invalidateQueries, getValues, gift]);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      reset({ name: null, description: null, link: null, coverUrl: null });
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (gift) {
      setValuesReactHookForm(setValue, gift, {
        ignoreKeys: ['id', 'createdAt', 'updatedAt', 'giftId'],
      });
    }
  }, [gift]);

  return (
    <Modal
      isOpen={isOpen}
      title={gift?.id ? t('components.modules.gift.edit') : t('components.modules.gift.add')}
      onClose={onClose}
    >
      <div className="space-y-3">
        <Input
          register={register('name')}
          error={errors.name}
          label={t('components.modules.gift.fields.name')}
          required
        />

        <Input
          register={register('description')}
          error={errors.description}
          label={t('components.modules.gift.fields.description')}
        />

        <Input
          register={register('link')}
          error={errors.description}
          label={t('components.modules.gift.fields.link')}
        />

        <Input
          register={register('coverUrl')}
          error={errors.description}
          label={t('components.modules.gift.fields.coverUrl')}
        />
      </div>

      <div className="mt-5">
        <Button className="m-auto" disabled={!isValid} isLoading={isLoading} onClick={() => onSubmit()}>
          {t('components.form.save')}
        </Button>
      </div>
      <FormDevTools control={control} />
    </Modal>
  );
};
