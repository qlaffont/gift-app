import clsx from 'clsx';
import isNil from 'lodash/isNil';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useBoolean, useDebounce } from 'usehooks-ts';

import { useI18n } from '../../../i18n/useI18n';
import { useCleanGiftListMutation } from '../../../services/apis/react-query/mutations/useCleanGiftListMutation';
import { useDeleteGiftMutation } from '../../../services/apis/react-query/mutations/useDeleteGiftMutation';
import { useTakenGiftMutation } from '../../../services/apis/react-query/mutations/useTakenGiftMutation';
import { useFindGiftListByIdQuery } from '../../../services/apis/react-query/queries/useFindGiftListByIdQuery';
import { useInvalidateQueries } from '../../../services/apis/react-query/useInvalidateQueries';
import { Gift, GiftList, GiftListAccess } from '../../../services/types/prisma.type';
import { useUser } from '../../../services/useUser';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { GiftFormModal, PriorityOptions } from '../gift/GiftFormModal';
import { GiftModal } from '../gift/GiftModal';
import { ConfirmModal } from '../modal/ConfirmModal';
import { GiftListAccessModal } from './GiftListAccessModal';
//@ts-ignore
const ReactMarkdown = dynamic(() => import('react-markdown').then((mod) => mod.default));

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
  const { value: isOpenGiftAccessModal, setValue: setIsOpenGiftAccessModal } = useBoolean();
  const { value: isOpenDeleteModal, setValue: setIsOpenDeleteModal } = useBoolean();
  const { value: isOpenConfirmModal, setValue: setIsOpenConfirmModal } = useBoolean();
  const { value: isOpenCleanTakenModal, setValue: setIsOpenCleanTakenModal } = useBoolean();
  const [password, setPassword] = useState<string>();
  const passwordDebounce = useDebounce(password, 300);

  const invalidateQueries = useInvalidateQueries();

  const { mutateAsync: deleteGift, isLoading: isLoadingDelete } = useDeleteGiftMutation();
  const { mutateAsync: takeGift, isLoading: isLoadingTaken } = useTakenGiftMutation();
  const { mutateAsync: cleanGiftList, isLoading: isLoadingClean } = useCleanGiftListMutation();

  const [gift, setGift] = useState<Partial<Gift>>();

  const router = useRouter();
  const user = useUser();

  const {
    data: giftListData,
    error,
    isFetched,
    isFetching,
  } = useFindGiftListByIdQuery(
    {
      userId: router.query.id as string,
      id: giftList.id,
      password: passwordDebounce,
    },
    {
      enabled:
        router.query.id &&
        giftList.id &&
        (giftList.access === 'EMAIL' ||
          giftList.access === 'PUBLIC' ||
          giftList.ownerId === user?.id ||
          (passwordDebounce && passwordDebounce?.length > 0)),
    },
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between">
        <div className="space-y-2">
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <h2
            className="flex cursor-pointer flex-wrap items-center gap-2 text-xl font-bold"
            onClick={() => setIsDeveloped((b) => !b)}
          >
            <div>{giftList.name}</div>
            {isFetching && (
              <div>
                <span className="icon icon-refresh block h-4 w-4 animate-spin bg-black dark:bg-white"></span>
              </div>
            )}
          </h2>
          <div className="[&>p]:pb-3">
            <ReactMarkdown>{giftList?.description}</ReactMarkdown>
          </div>
        </div>
        <div className="flex justify-end gap-1">
          {isUser && (
            <>
              {isNil(giftListData?.resetTakenWhen) && (
                <div>
                  <Button
                    prefixIcon="icon icon-square-check !h-4 !w-4 ml-1 md:!m-0 my-1 md:!h-3 md:!w-3"
                    variant="info"
                    size="small"
                    onClick={() => {
                      setIsOpenCleanTakenModal(true);
                    }}
                  >
                    <span className="hidden md:block">{t('pages.profile.giftList.cleanTaken')}</span>
                  </Button>
                </div>
              )}
              {giftList.access === GiftListAccess.EMAIL && (
                <div>
                  <Button
                    prefixIcon="icon icon-user-list !h-4 !w-4 ml-1 md:!m-0 my-1 md:!h-3 md:!w-3"
                    variant="info"
                    size="small"
                    onClick={() => {
                      setIsOpenGiftAccessModal(true);
                    }}
                  >
                    <span className="hidden md:block">{t('pages.profile.giftList.accessBtn')}</span>
                  </Button>
                </div>
              )}
              <div>
                <Button
                  prefixIcon="icon icon-pen !h-4 !w-4 ml-1 md:!m-0 my-1 md:!h-3 md:!w-3"
                  variant="warning"
                  size="small"
                  onClick={() => {
                    onEdit();
                  }}
                >
                  <span className="hidden md:block">{t('pages.profile.giftList.editBtn')}</span>
                </Button>
              </div>
              <div>
                <Button
                  prefixIcon="icon icon-trash !h-4 !w-4 ml-1 md:!m-0 my-1 md:!h-3 md:!w-3"
                  variant="error"
                  size="small"
                  onClick={() => {
                    onDelete();
                  }}
                >
                  <span className="hidden md:block">{t('pages.profile.giftList.deleteBtn')}</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {isDeveloped && (
        <>
          <div className="flex flex-col items-center gap-2 overflow-auto rounded-md bg-zinc-100 p-5 dark:bg-zinc-800 sm:flex-row md:hidden">
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

            {giftListData?.gifts
              .sort((a, b) => b.priority - a.priority)
              .map((v) => (
                <div
                  key={v.id}
                  className={clsx(
                    'block cursor-pointer rounded-md border border-black',
                    'border-opacity-20 !bg-cover !bg-center hover:opacity-70 dark:border-white',
                    !isUser && !isNil(v.takenWhen) ? 'opacity-20' : '',
                  )}
                  style={!isNil(v.coverUrl) ? { background: `url(${v.coverUrl})` } : {}}
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
                      <div className="w-full rounded-b-md bg-slate-200 bg-opacity-80 p-3 dark:bg-zinc-700 dark:bg-opacity-80 ">
                        <p className="line-clamp-1">{v.name}</p>
                        <p className="text-sm line-clamp-2">{v.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {(!giftListData?.gifts || giftListData?.gifts?.length === 0) &&
              giftList.access === GiftListAccess.PASSWORD_PROTECTED && (
                <div className="m-auto text-center">
                  <Input
                    label={t('pages.profile.giftList.fields.password')}
                    blockClassName="bg-white"
                    onChange={(e) => setPassword(e?.target?.value)}
                    error={
                      error && isFetched && passwordDebounce?.length > 0
                        ? { message: 'pages.profile.giftList.passwordInvalid' }
                        : ''
                    }
                  />
                </div>
              )}

            {(!giftListData?.gifts || giftListData?.gifts?.length === 0) &&
              giftList.access === GiftListAccess.EMAIL && (
                <div className="m-auto text-center">
                  <p className="text-sm font-bold">{t('pages.profile.giftList.accessOrEmpty')}</p>
                </div>
              )}
          </div>

          <div className="hidden gap-2 overflow-auto rounded-md bg-zinc-100 p-5 dark:bg-zinc-800 sm:flex-row md:block">
            <div className="flex items-center justify-end gap-2">
              {isUser && (
                <div
                  className="flex cursor-pointer items-center justify-end rounded-md border-opacity-20 pb-5 hover:opacity-70"
                  onClick={() => {
                    setGift(undefined);
                    setIsOpenGiftFormModal(true);
                  }}
                >
                  <Button variant="success" size="small" prefixIcon="icon icon-shopping-bag">
                    {t('components.modules.gift.add')}
                  </Button>
                </div>
              )}

              <Link
                href={`/gift-lists/${router.query.username}/${router.query.id}/${giftListData?.id}/print${
                  passwordDebounce && passwordDebounce?.length > 0 ? `?password=${passwordDebounce}` : ``
                }`}
                target="_blank"
                className="flex cursor-pointer items-center justify-end rounded-md border-opacity-20 pb-5 hover:opacity-70"
              >
                <Button variant="info" size="small" prefixIcon="icon icon-print">
                  {t('components.modules.giftList.print')}
                </Button>
              </Link>
            </div>

            <div className="space-y-5">
              {giftListData?.gifts
                .sort((a, b) => b.priority - a.priority)
                .map((v) => (
                  <div
                    className={clsx(
                      'flex w-full cursor-pointer gap-2 hover:opacity-50',
                      !isUser && !isNil(v.takenWhen) ? 'opacity-20' : '',
                    )}
                    key={v.id}
                    onClick={() => {
                      setGift(v);
                      setIsOpenGiftViewModal(true);
                    }}
                  >
                    <div
                      className="h-52 w-[20%] rounded-md border !bg-cover !bg-center !bg-no-repeat"
                      style={!isNil(v.coverUrl) ? { backgroundImage: `url(${v.coverUrl})` } : {}}
                    ></div>

                    <div className="flex w-full flex-grow flex-col justify-between rounded-md bg-slate-200 bg-opacity-80 p-3 dark:bg-zinc-700 dark:bg-opacity-80">
                      <div className="w-full">
                        <div className="w-full space-y-2 ">
                          {v.priority > 0 && (
                            <div>
                              <Button
                                prefixIcon="icon icon-gift"
                                variant={v.priority === 3 ? 'error' : v.priority === 2 ? 'warning' : 'info'}
                                size="roundSmall"
                                className="!py-1"
                              >
                                <span className="text-sm">
                                  {PriorityOptions(t).find((e) => e.value === v.priority).label}
                                </span>
                              </Button>
                            </div>
                          )}
                          <p className="text-lg font-bold line-clamp-1">{v.name}</p>
                          <p className="text-ellipsis text-sm line-clamp-2">{v.description}</p>
                        </div>
                      </div>

                      <div>
                        <Button variant="info" className="mx-auto">
                          <span className="hidden md:block">{t('pages.profile.giftList.seeMore')}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {(!giftListData?.gifts || giftListData?.gifts?.length === 0) &&
              giftList.access === GiftListAccess.PASSWORD_PROTECTED && (
                <div className="m-auto w-fit text-center">
                  <Input
                    label={t('pages.profile.giftList.fields.password')}
                    blockClassName="bg-white"
                    onChange={(e) => setPassword(e?.target?.value)}
                    error={
                      error && isFetched && passwordDebounce?.length > 0
                        ? { message: 'pages.profile.giftList.passwordInvalid' }
                        : ''
                    }
                  />
                </div>
              )}

            {(!giftListData?.gifts || giftListData?.gifts?.length === 0) &&
              giftList.access === GiftListAccess.EMAIL && (
                <div className="m-auto text-center">
                  <p className="text-sm font-bold">{t('pages.profile.giftList.accessOrEmpty')}</p>
                </div>
              )}
          </div>
        </>
      )}
      <GiftFormModal
        isOpen={isOpenGiftFormModal}
        onClose={() => setIsOpenGiftFormModal(false)}
        giftListId={giftList.id}
        gift={gift}
      />
      <GiftModal
        isOpen={isOpenGiftViewModal}
        onClose={() => {
          setIsOpenGiftViewModal(false);
          setGift(undefined);
        }}
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
        onAlreadyBuy={
          !isUser
            ? () => {
                setIsOpenGiftViewModal(false);
                setIsOpenConfirmModal(true);
              }
            : undefined
        }
        canSeeTaken={!isUser}
      />

      <GiftListAccessModal
        isOpen={isOpenGiftAccessModal}
        onClose={() => setIsOpenGiftAccessModal(false)}
        giftList={giftList}
      />

      <ConfirmModal
        title={t('components.modules.gift.delete')}
        description={t('components.modules.gift.deleteDescription')}
        isOpen={isOpenDeleteModal}
        isLoading={isLoadingDelete}
        onClose={() => {
          setIsOpenDeleteModal(false);
          setGift(undefined);
        }}
        onAction={async () => {
          await deleteGift({
            id: gift.id,
            userId: router.query.id as string,
            giftListId: giftListData.id,
          });
          await invalidateQueries([
            'findGiftListById',
            {
              userId: router.query.id,
              id: giftList.id,
            },
          ]);
        }}
        actionLabel={t('components.form.delete')}
      />

      <ConfirmModal
        title={t('components.modules.gift.takenTitle')}
        description={t('components.modules.gift.takenDescription')}
        isOpen={isOpenConfirmModal}
        isLoading={isLoadingTaken}
        onClose={() => {
          setIsOpenConfirmModal(false);
          setGift(undefined);
        }}
        actionLabel={t('components.modules.gift.takenAction')}
        onAction={async () => {
          try {
            await takeGift({
              userId: router.query.id as string,
              giftListId: giftList.id,
              id: gift.id,
            });
            await invalidateQueries([
              'findGiftListById',
              {
                userId: router.query.id,
                id: giftList.id,
              },
            ]);
          } catch (error) {
            toast.error(t('components.modules.gift.takenError'));
          }
        }}
      />
      <ConfirmModal
        title={t('pages.profile.giftList.cleanTaken')}
        description={t('pages.profile.giftList.cleanTakenDescription')}
        isOpen={isOpenCleanTakenModal}
        isLoading={isLoadingClean}
        onClose={() => {
          setIsOpenCleanTakenModal(false);
        }}
        actionLabel={t('components.form.confirm')}
        onAction={async () => {
          await cleanGiftList({
            userId: router.query.id as string,
            id: giftList.id,
          });
          await invalidateQueries([
            'findGiftListById',
            {
              userId: router.query.id,
              id: giftList.id,
            },
          ]);
        }}
      />
    </div>
  );
};
