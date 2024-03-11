import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIsClient } from 'usehooks-ts';

import { Button } from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import { SEO } from '../../components/atoms/SEO';
import { useI18n } from '../../i18n/useI18n';
import RestAPIService from '../../services/apis/RestAPIService';

const Login = () => {
  const { t } = useI18n();
  const isBrowser = useIsClient();
  const { query } = useRouter();

  useEffect(() => {
    if (query.redirectURL && isBrowser) {
      window.localStorage.setItem('redirectURL', JSON.stringify(query.redirectURL));
    }
  }, [query, isBrowser]);

  return (
    <Modal isOpen={true} title={t('pages.auth.login.title')}>
      <SEO title={t('pages.auth.login.title')} />
      <div className="space-y-2">
        <Link href={`${RestAPIService.login}?method=google`} className="flex">
          <Button className="m-auto w-full max-w-xs" prefixIcon="brand bg-google">
            {t('pages.auth.login.google')}
          </Button>
        </Link>

        <Link href={`${RestAPIService.login}?method=discord`} className="flex">
          <Button variant="discord" className="m-auto w-full max-w-xs" prefixIcon="brand icon-discord">
            {t('pages.auth.login.discord')}
          </Button>
        </Link>
      </div>
    </Modal>
  );
};

export default Login;
