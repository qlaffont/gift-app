import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSsr } from 'usehooks-ts';

import { Button } from '../../../components/atoms/Button';
import { useI18n } from '../../../i18n/useI18n';
import {
  findUserByIdFetcher,
  useFindUserByIdQuery,
} from '../../../services/apis/react-query/queries/useFindUserByIdQuery';

const Profile = () => {
  const router = useRouter();
  const { t } = useI18n();
  const { isBrowser } = useSsr();

  const { data: user } = useFindUserByIdQuery({ id: router.query.id as string }, { enabled: !!router.query.id });

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
    <div>
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
