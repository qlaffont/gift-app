import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useBoolean } from 'usehooks-ts';

import { useI18n } from '../../../i18n/useI18n';
import { useCreateGiftListMutation } from '../../../services/apis/react-query/mutations/useCreateGiftListMutation';
import { useUpdateGiftListMutation } from '../../../services/apis/react-query/mutations/useUpdateGiftListMutation';
import { useInvalidateQueries } from '../../../services/apis/react-query/useInvalidateQueries';
import { setValuesReactHookForm } from '../../../services/setValuesReactHookForm';
import { GiftList, GiftListAccess } from '../../../services/types/prisma.type';
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

const DatePicker = dynamic(() => import('../../atoms/DatePicker').then((mod) => mod.DatePicker), { ssr: false });

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
  const invalidateQueries = useInvalidateQueries();
  const router = useRouter();
  const { mutateAsync: createGiftList } = useCreateGiftListMutation();
  const { mutateAsync: updateGiftList } = useUpdateGiftListMutation();
  const { value: isLoading, setValue: setIsLoading } = useBoolean();

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
    getValues,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const access = useWatch({ control, name: 'access' });
  const resetTakenWhen = useWatch({ control, name: 'resetTakenWhen' });

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = getValues();

      if (giftList) {
        await updateGiftList({
          ...data,
          id: giftList?.id,
          userId: router.query.id as string,
        });
        await invalidateQueries([
          'findGiftListById',
          {
            id: giftList?.id,
            userId: router.query.id as string,
          },
        ]);
        onClose();
      } else {
        await createGiftList({
          ...data,
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
  }, [router, invalidateQueries, getValues, giftList]);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      reset({ name: null, description: null, access: GiftListAccess.PUBLIC, password: null, resetTakenWhen: null });
    } else {
      if (!giftList) {
        setValuesReactHookForm(setValue, { access: GiftListAccess.PUBLIC });
      }
    }
  }, [isOpen, reset]);

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

        {access === GiftListAccess.PASSWORD_PROTECTED && (
          <Input
            register={register('password')}
            error={errors.password}
            type="password"
            label={t('pages.profile.giftList.fields.password')}
          />
        )}

        <DatePicker
          label={t('pages.profile.giftList.fields.resetTakenWhen')}
          error={errors?.resetTakenWhen}
          value={resetTakenWhen ? new Date(resetTakenWhen) : undefined}
          onChange={(date) => {
            setValuesReactHookForm(setValue, {
              resetTakenWhen: date ? date.toISOString() : undefined,
            });
          }}
          className="m-auto max-w-xl"
          minDate={new Date()}
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
