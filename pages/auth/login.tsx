import Link from 'next/link';

import { Button } from '../../components/atoms/Button';
import Modal from '../../components/atoms/Modal';
import { useI18n } from '../../i18n/useI18n';
import RestAPIService from '../../services/apis/RestAPIService';

const Login = () => {
  const { t } = useI18n();

  return (
    <Modal isOpen={true} title={t('pages.auth.login.title')}>
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
