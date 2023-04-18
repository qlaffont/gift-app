import { yupResolver } from '@hookform/resolvers/yup';
import { isNil } from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useBoolean } from 'usehooks-ts';

import { useI18n } from '../../../i18n/useI18n';
import { useCreateGiftMutation } from '../../../services/apis/react-query/mutations/useCreateGiftMutation';
import { useFetchOGDataMutation } from '../../../services/apis/react-query/mutations/useFetchOGDataMutation';
import { useUpdateGiftMutation } from '../../../services/apis/react-query/mutations/useUpdateGiftMutation';
import { useInvalidateQueries } from '../../../services/apis/react-query/useInvalidateQueries';
import { setValuesReactHookForm } from '../../../services/setValuesReactHookForm';
import { Gift } from '../../../services/types/prisma.type';
import { useYup } from '../../../services/useYup';
import { Button } from '../../atoms/Button';
import { FormDevTools } from '../../atoms/FormDevTool';
import { Input } from '../../atoms/Input';
import Modal from '../../atoms/Modal';
import { Select } from '../../atoms/Select/Select';

const TextAreaMarkdown = dynamic(() => import('../../atoms/TextAreaMarkdown').then((mod) => mod.TextAreaMarkdown), {
  ssr: false,
});

export const PriorityOptions = (t) => {
  return [
    { value: 0, label: t('components.modules.gift.priority.nc') },
    { value: 1, label: t('components.modules.gift.priority.low') },
    { value: 2, label: t('components.modules.gift.priority.middle') },
    { value: 3, label: t('components.modules.gift.priority.high') },
  ];
};

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

  const { mutateAsync: fetchData, isLoading: isLoadingFetchData } = useFetchOGDataMutation();

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(),
        description: yup.string().optional().nullable(),
        link: yup.string().url().optional().nullable(),
        coverUrl: yup.string().optional().nullable(),
        priority: yup.number().optional().nullable(),
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
            userId: router.query.id,
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
      await invalidateQueries([
        'findGiftListById',
        {
          userId: router.query.id,
          id: giftListId,
        },
      ]);
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

  const link = useWatch({ control, name: 'link' });

  const onFetch = useCallback(async () => {
    const data = await fetchData({ url: link });

    const name = isNil(data.title) ? (isNil(data['og:title']) ? undefined : data['og:title']) : data.title;
    const description = isNil(data.description)
      ? isNil(data['og:description'])
        ? undefined
        : data['og:description']
      : data.description;
    const image = isNil(data.image) ? (isNil(data['og:image']) ? undefined : data['og:image']) : data.image;

    if (!isNil(name)) {
      setValue('name', name);
    }
    if (!isNil(description)) {
      setValue('description', description);
    }
    if (!isNil(image)) {
      setValue('coverUrl', image);
    }
  }, [setValue, link]);

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

        <TextAreaMarkdown
          name={'description'}
          control={control}
          error={errors.description}
          label={t('components.modules.gift.fields.description')}
        />

        <div className="flex w-full items-center">
          <div className="grow">
            <Input
              register={register('link')}
              error={errors.link}
              label={t('components.modules.gift.fields.link')}
              blockClassName="!rounded-r-none"
            />
          </div>
          <div className="pt-7">
            <Button
              className="m-auto !rounded-l-none py-[0.68rem] text-sm"
              disabled={!link || link?.length <= 0 || !!errors.link}
              isLoading={isLoadingFetchData || isLoading}
              onClick={async () => {
                if (link?.length > 0) {
                  onFetch();
                }
              }}
              prefixIcon="icon icon-download !h-5 !w-5"
            ></Button>
          </div>
        </div>

        <Input
          register={register('coverUrl')}
          error={errors.coverUrl}
          label={t('components.modules.gift.fields.coverUrl')}
        />

        <Select
          control={control}
          name="priority"
          error={errors.priority}
          options={PriorityOptions(t)}
          label={t('components.modules.gift.fields.priority')}
          isSearchable={false}
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
