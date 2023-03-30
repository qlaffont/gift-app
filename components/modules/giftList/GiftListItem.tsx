import { Gift, GiftList } from '@prisma/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useBoolean } from 'usehooks-ts';

import { useI18n } from '../../../i18n/useI18n';
import { useDeleteGiftMutation } from '../../../services/apis/react-query/mutations/useDeleteGiftMutation';
import { useFindGiftListByIdQuery } from '../../../services/apis/react-query/queries/useFindGiftListByIdQuery';
import { useInvalidateQueries } from '../../../services/apis/react-query/useInvalidateQueries';
import { Button } from '../../atoms/Button';
import { DeleteModal } from '../delete/DeleteModal';
import { GiftFormModal } from '../gift/GiftFormModal';
import { GiftModal } from '../gift/GiftModal';

export const GiftListItem = ({
  isUser,
  onEdit,
  onDelete,
  giftList,
}: {
  isUser: boolean;
  onEdit: () => void;
  onDelete: () => void;
  giftList: Partial<GiftList>;
}) => {
  const { t } = useI18n();
  const { value: isDeveloped, setValue: setIsDeveloped } = useBoolean(true);
  const { value: isOpenGiftFormModal, setValue: setIsOpenGiftFormModal } = useBoolean();
  const { value: isOpenGiftViewModal, setValue: setIsOpenGiftViewModal } = useBoolean();
  const { value: isOpenDeleteModal, setValue: setIsOpenDeleteModal } = useBoolean();

  const invalidateQueries = useInvalidateQueries();

  const { mutateAsync: deleteGift, isLoading: isLoadingDelete } = useDeleteGiftMutation();

  const [gift, setGift] = useState<Partial<Gift>>();

  const router = useRouter();

  const { data: giftListData } = useFindGiftListByIdQuery(
    {
      userId: router.query.username as string,
      id: giftList.id,
    },
    { enabled: router.query.id && giftList.id && (giftList.access === 'EMAIL' || giftList.access === 'PUBLIC') },
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <h2 className="cursor-pointer text-xl font-bold" onClick={() => setIsDeveloped((b) => !b)}>
            {giftList.name}
          </h2>
          <p className="text-description">{giftList.description}</p>
        </div>
        <div className="flex justify-end gap-1">
          {isUser && (
            <>
              <div>
                <Button
                  prefixIcon="icon icon-pen"
                  variant="warning"
                  size="small"
                  onClick={() => {
                    onEdit();
                  }}
                >
                  {t('pages.profile.giftList.editBtn')}
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
                  {t('pages.profile.giftList.deleteBtn')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {isDeveloped && (
        <div className="flex flex-col items-center gap-2 overflow-auto rounded-md bg-zinc-100 p-5 dark:bg-zinc-800 sm:flex-row">
          {isUser && (
            <div className="h-52 w-52">
              <div
                className="flex h-52 w-52 cursor-pointer items-center justify-center rounded-md border border-black border-opacity-20 hover:opacity-70 dark:border-white"
                onClick={() => {
                  setGift(undefined);
                  setIsOpenGiftFormModal(true);
                }}
              >
                <Button variant="success" size="small" suffixIcon="icon icon-gift">
                  +
                </Button>
              </div>
            </div>
          )}

          {giftListData?.gifts.map((v) => (
            <div
              key={v.id}
              className="block h-52 w-52 cursor-pointer rounded-md border border-black border-opacity-20 bg-cover bg-center hover:opacity-70 dark:border-white"
              style={{ background: v.coverUrl }}
              onClick={() => {
                setGift(v);
                setIsOpenGiftViewModal(true);
              }}
            >
              <div className="flex h-52 w-52 flex-col justify-between">
                <div className="p-3">
                  {v.priority > 0 && (
                    <Button
                      prefixIcon="icon icon-gift"
                      variant={v.priority === 3 ? 'error' : v.priority === 2 ? 'warning' : 'info'}
                      size="roundSmall"
                    ></Button>
                  )}
                </div>

                <div className="w-full">
                  <div className="w-full rounded-b-md bg-black bg-opacity-10 p-3 dark:bg-white dark:bg-opacity-10 ">
                    <p className="line-clamp-1">{v.name}</p>
                    <p className="text-sm line-clamp-2">{v.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <GiftFormModal
        isOpen={isOpenGiftFormModal}
        onClose={() => setIsOpenGiftFormModal(false)}
        giftListId={giftList.id}
        gift={gift}
      />
      <GiftModal
        isOpen={isOpenGiftViewModal}
        onClose={() => setIsOpenGiftViewModal(false)}
        gift={gift}
        onEdit={
          isUser
            ? () => {
                setIsOpenGiftViewModal(false);
                setIsOpenGiftFormModal(true);
              }
            : undefined
        }
        onDelete={
          isUser
            ? () => {
                setIsOpenGiftViewModal(false);
                setIsOpenDeleteModal(true);
              }
            : undefined
        }
      />

      <DeleteModal
        title={t('components.modules.gift.delete')}
        description={t('components.modules.gift.deleteDescription')}
        isOpen={isOpenDeleteModal}
        isLoading={isLoadingDelete}
        onClose={() => setIsOpenDeleteModal(false)}
        onDelete={async () => {
          await deleteGift({
            id: gift.id,
            userId: router.query.id as string,
            giftListId: giftListData.id,
          });
          await invalidateQueries([
            'findGiftListById',
            {
              userId: router.query.username,
              id: giftList.id,
            },
          ]);
        }}
      />
    </div>
  );
};
