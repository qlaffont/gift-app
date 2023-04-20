import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useBoolean, useSsr } from 'usehooks-ts';

import { Button } from '../../../components/atoms/Button';
import { SEO } from '../../../components/atoms/SEO';
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
  const { isBrowser } = useSsr();
  const connectedUser = useUser();
  const invalidateQueries = useInvalidateQueries();

  const [currentGiftList, setCurrentGiftList] = useState<Partial<GiftList>>();
  const { value: isOpenGiftListModal, setValue: setIsOpenGiftListModal } = useBoolean();
  const { value: isOpenDeleteModal, setValue: setIsOpenDeleteModal } = useBoolean();
  const { value: isOpenEditModal, setValue: setIsOpenEditModal } = useBoolean();

  const { mutateAsync: deleteGiftList, isLoading: isLoadingDelete } = useDeleteGiftListMutation();

  const { data: user } = useFindUserByIdQuery(
    { id: router.query.id as string },
    { enabled: router?.query?.id?.length > 0 },
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

  return (
    <div className="space-y-5">
      <SEO title={t('pages.profile.seo', { username: router.query.username as string })} />
      <div className="flex flex-wrap justify-between">
        <div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{user?.name || router?.query?.username}</h1>
            {user?.description && <ReactMarkdown>{user?.description}</ReactMarkdown>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {isUser && (
            <Button prefixIcon="icon icon-pen" variant="warning" onClick={() => setIsOpenEditModal(true)}>
              {t('pages.profile.edit.editAction')}
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
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['findUserById', { id: params.id }], findUserByIdFetcher(params));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Profile;
