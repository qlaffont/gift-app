import { yupResolver } from '@hookform/resolvers/yup';
import { GiftList, GiftListAccess } from '@prisma/client';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useI18n } from '../../../i18n/useI18n';
import { setValuesReactHookForm } from '../../../services/setValuesReactHookForm';
import { useYup } from '../../../services/useYup';
import { Button } from '../../atoms/Button';
import { FormDevTools } from '../../atoms/FormDevTool';
import { Input } from '../../atoms/Input';
import Modal from '../../atoms/Modal';
import { Select, SelectOption } from '../../atoms/Select/Select';

export const GiftListAccessOptions = (t) =>
  Object.values(GiftListAccess).map((v) => ({
    label: t(`enums.GiftListAccess.${v}`),
    value: v,
  })) as SelectOption[];

export const GiftListModal = ({
  giftList,
  isOpen,
  onClose,
}: {
  giftList?: Partial<GiftList>;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useI18n();
  const yup = useYup();

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(),
        description: yup.string().optional().nullable(),
        resetTakenWhen: yup.date().optional().nullable(),
        access: yup.string().oneOf(Object.values(GiftListAccess)).required(),
        password: yup.string().optional().nullable(),
      }),
    [yup],
  );

  const {
    register,
    control,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    } else {
      if (!giftList) {
        setValuesReactHookForm(setValue, { access: GiftListAccess.PUBLIC });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (giftList) {
      setValuesReactHookForm(setValue, giftList, {
        ignoreKeys: ['id', 'createdAt', 'updatedAt', 'giftListUserAccesses', 'ownerId', 'password'],
      });
    }
  }, [giftList]);

  return (
    <Modal
      isOpen={isOpen}
      title={giftList?.id ? t('pages.profile.giftList.edit') : t('pages.profile.giftList.add')}
      onClose={onClose}
    >
      <div className="space-y-3">
        <Input
          register={register('name')}
          error={errors.name}
          label={t('pages.profile.giftList.fields.name')}
          required
        />

        <Input
          register={register('description')}
          error={errors.description}
          label={t('pages.profile.giftList.fields.description')}
        />

        <Select
          control={control}
          name="access"
          error={errors.access}
          options={GiftListAccessOptions(t)}
          label={t('pages.profile.giftList.fields.access')}
          isSearchable={false}
        />

        <Input
          register={register('password')}
          error={errors.password}
          label={t('pages.profile.giftList.fields.password')}
        />

        {/* TODO : Finish reset taken, Implement date picker, and branch submit with create/update  */}
        <Input
          register={register('resetTakenWhen')}
          error={errors.resetTakenWhen}
          label={t('pages.profile.giftList.fields.resetTakenWhen')}
        />
      </div>

      <div className="mt-5">
        <Button className="m-auto" disabled={!isValid}>
          {t('components.form.save')}
        </Button>
      </div>
      <FormDevTools control={control} />
    </Modal>
  );
};
