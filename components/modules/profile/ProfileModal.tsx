import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useBoolean } from 'usehooks-ts';

import { useI18n } from '../../../i18n/useI18n';
import { useUpdateUserMutation } from '../../../services/apis/react-query/mutations/useUpdateUserMutation';
import { useInvalidateQueries } from '../../../services/apis/react-query/useInvalidateQueries';
import { setValuesReactHookForm } from '../../../services/setValuesReactHookForm';
import { GiftListAccess } from '../../../services/types/prisma.type';
import { useUser } from '../../../services/useUser';
import { useYup } from '../../../services/useYup';
import { Button } from '../../atoms/Button';
import { FormDevTools } from '../../atoms/FormDevTool';
import { Input } from '../../atoms/Input';
import Modal from '../../atoms/Modal';
import { SelectOption } from '../../atoms/Select/Select';

const TextAreaMarkdown = dynamic(() => import('../../atoms/TextAreaMarkdown').then((mod) => mod.TextAreaMarkdown), {
  ssr: false,
});

export const GiftListAccessOptions = (t) =>
  Object.values(GiftListAccess).map((v) => ({
    label: t(`enums.GiftListAccess.${v}`),
    value: v,
  })) as SelectOption[];

export const ProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useI18n();
  const yup = useYup();
  const invalidateQueries = useInvalidateQueries();
  const router = useRouter();
  const user = useUser();
  const { value: isLoading, setValue: setIsLoading } = useBoolean();
  const { mutateAsync: updateUser } = useUpdateUserMutation();

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(),
        description: yup.string().optional().nullable(),
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

      await updateUser({
        name: data.name,
        description: data.description,
      });

      await invalidateQueries(['findUserById', { id: user?.id }]);
      await invalidateQueries(['getUserMe']);
      onClose();
      toast.success(t('components.atoms.alert.changesSaved'));
    } catch (error) {
      setIsLoading(false);
      toast.error(t('components.atoms.alert.errorTryLater'));
    }
  }, [router, invalidateQueries, getValues, user]);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    } else {
      setValuesReactHookForm(setValue, {
        name: user?.name,
        description: user?.description,
      });
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} title={t('pages.profile.edit.editTitle')} onClose={onClose}>
      <div className="space-y-3">
        <Input register={register('name')} error={errors.name} label={t('pages.profile.edit.name')} required />

        <TextAreaMarkdown
          name={'description'}
          control={control}
          error={errors.description}
          label={t('pages.profile.edit.description')}
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
