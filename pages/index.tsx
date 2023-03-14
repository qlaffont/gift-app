import { useI18n } from '../i18n/useI18n';

const Home = () => {
  const { t } = useI18n();

  return <p>{t('pages.home.hello')}</p>;
};

export default Home;
