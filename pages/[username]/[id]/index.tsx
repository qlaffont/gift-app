import { dehydrate, QueryClient } from '@tanstack/react-query';
import { isNil } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useBoolean, useIsClient } from 'usehooks-ts';

import { Button } from '../../../components/atoms/Button';
import { SEO } from '../../../components/atoms/SEO';
import { GiftListInstructionsModal } from '../../../components/modules/giftList/GiftListInstructionsModal';
import { GiftListItem } from '../../../components/modules/giftList/GiftListItem';
import { GiftListModal } from '../../../components/modules/giftList/GiftListModal';
import { ConfirmModal } from '../../../components/modules/modal/ConfirmModal';
import { ProfileModal } from '../../../components/modules/profile/ProfileModal';
import { useI18n } from '../../../i18n/useI18n';
import { useDeleteGiftListMutation } from '../../../services/apis/react-query/mutations/useDeleteGiftListMutation';
import {
  findUserByIdFetcher,
  useFindUserByIdQuery,
} from '../../../services/apis/react-query/queries/useFindUserByIdQuery';
import { useInvalidateQueries } from '../../../services/apis/react-query/useInvalidateQueries';
import { GiftList } from '../../../services/types/prisma.type';
import { useUser } from '../../../services/useUser';

const Profile = () => {
  const router = useRouter();
  const { t } = useI18n();
  const isBrowser = useIsClient();
  const connectedUser = useUser();
  const invalidateQueries = useInvalidateQueries();

  const [currentGiftList, setCurrentGiftList] = useState<Partial<GiftList>>();
  const { value: isOpenGiftListModal, setValue: setIsOpenGiftListModal } = useBoolean();
  const { value: isOpenDeleteModal, setValue: setIsOpenDeleteModal } = useBoolean();
  const { value: isOpenEditModal, setValue: setIsOpenEditModal } = useBoolean();
  const { value: isOpenInstructionsModal, setValue: setIsOpenInstructionsModal } = useBoolean();

  const { mutateAsync: deleteGiftList, isPending: isLoadingDelete } = useDeleteGiftListMutation();
  const { data: user, isLoading } = useFindUserByIdQuery(
    { id: router.query.id as string },
    //@ts-ignore
    { enabled: !isNil(router?.query?.id) && router?.query?.id?.length > 0 },
  );

  const isUser = useMemo(() => connectedUser?.id === router.query.id, [connectedUser]);
  const onShare = useCallback(async () => {
    if (isBrowser) {
      if (navigator.canShare) {
        await navigator.share({
          text: t('pages.profile.shareMessage'),
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(`${t('pages.profile.shareMessage')} : ${window.location.href}`);
        toast.success(t('components.atoms.alert.copied'));
      }
    }
  }, [isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      if (user && !isUser && !localStorage.getItem('instructionsGiven')) {
        setIsOpenInstructionsModal(true);
      }

      if (user && isUser) {
        setIsOpenInstructionsModal(false);
      }
    }
  }, [isBrowser, isUser, user]);

  return (
    <div className="space-y-5">
      <SEO title={t('pages.profile.seo', { username: router.query.username as string })} />
      <div className="flex flex-wrap justify-between">
        <div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{user?.name || router?.query?.username}</h1>
            {user?.description && <Markdown>{user?.description}</Markdown>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {isLoading && (
            <div>
              <i className="icon icon-refresh mb-2 block h-7 w-7 animate-spin bg-black dark:bg-white"></i>
            </div>
          )}
          {isUser ? (
            <Button prefixIcon="icon icon-pen" variant="warning" onClick={() => setIsOpenEditModal(true)}>
              {t('pages.profile.edit.editAction')}
            </Button>
          ) : (
            <Button variant="info" prefixIcon="icon icon-info" onClick={() => setIsOpenInstructionsModal(true)}>
              {t('pages.profile.info')}
            </Button>
          )}
          <Button prefixIcon="icon icon-share" onClick={() => onShare()}>
            {t('pages.profile.share')}
          </Button>
        </div>
      </div>

      {isUser && (
        <div className="flex justify-end">
          <div>
            <Button
              prefixIcon="icon icon-list-add !w-3.5"
              variant="success"
              size="small"
              onClick={() => {
                setCurrentGiftList(undefined);
                setIsOpenGiftListModal(true);
              }}
            >
              {t('pages.profile.giftList.add')}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-5 pb-5">
        {user?.giftLists?.map((v) => (
          <GiftListItem
            key={v.id}
            isUser={isUser}
            onEdit={() => {
              setCurrentGiftList(v);
              setIsOpenGiftListModal(true);
            }}
            onDelete={() => {
              setCurrentGiftList(v);
              setIsOpenDeleteModal(true);
            }}
            giftList={v}
          />
        ))}
      </div>

      <GiftListModal
        isOpen={isOpenGiftListModal}
        giftList={currentGiftList}
        onClose={() => setIsOpenGiftListModal(false)}
      />
      <ProfileModal isOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)} />
      <ConfirmModal
        title={t('pages.profile.giftList.delete')}
        description={t('pages.profile.giftList.deleteDescription')}
        isOpen={isOpenDeleteModal}
        isLoading={isLoadingDelete}
        onClose={() => setIsOpenDeleteModal(false)}
        onAction={async () => {
          await deleteGiftList({
            id: currentGiftList?.id,
            userId: currentGiftList?.ownerId,
          });
          await invalidateQueries(['findUserById', { id: router.query.id }]);
        }}
        actionLabel={t('components.form.delete')}
      />
      <GiftListInstructionsModal
        isOpen={isOpenInstructionsModal}
        onClose={() => {
          if (isBrowser) {
            setIsOpenInstructionsModal(false);
            localStorage.setItem('instructionsGiven', 'true');
          }
        }}
      />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  if (!isNil(params?.id) && params?.id !== '<no source>') {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
      queryKey: ['findUserById', { id: params.id }],
      queryFn: findUserByIdFetcher({
        id: params.id,
      }),
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  }

  return { props: {} };
}

export default Profile;
