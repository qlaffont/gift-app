import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useBoolean, useSsr } from 'usehooks-ts';

import { Button } from '../../../components/atoms/Button';
import { DeleteModal } from '../../../components/modules/delete/DeleteModal';
import { GiftListModal } from '../../../components/modules/giftList/GiftListModal';
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
      <div className="flex flex-wrap justify-between">
        <div>
          <div>
            <h1 className="text-2xl font-bold">{router?.query?.username || user?.name}</h1>
            {user?.description && <p>{user?.description}</p>}
          </div>
        </div>

        <div>
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

      {user?.giftLists?.map((v) => (
        <div key={v.id}>
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{v.name}</h2>
              <p className="text-description">{v.description}</p>
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
                        setCurrentGiftList(v);
                        setIsOpenGiftListModal(true);
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
                        setCurrentGiftList(v);
                        setIsOpenDeleteModal(true);
                      }}
                    >
                      {t('pages.profile.giftList.deleteBtn')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      <GiftListModal
        isOpen={isOpenGiftListModal}
        giftList={currentGiftList}
        onClose={() => setIsOpenGiftListModal(false)}
      />
      <DeleteModal
        title={t('pages.profile.giftList.delete')}
        description={t('pages.profile.giftList.deleteDescription')}
        isOpen={isOpenDeleteModal}
        isLoading={isLoadingDelete}
        onClose={() => setIsOpenDeleteModal(false)}
        onDelete={async () => {
          await deleteGiftList({
            id: currentGiftList?.id,
            userId: currentGiftList?.ownerId,
          });
          await invalidateQueries(['findUserById', { id: router.query.id }]);
        }}
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
