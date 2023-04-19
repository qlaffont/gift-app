import { SEO } from '../components/atoms/SEO';
import { useI18n } from '../i18n/useI18n';

const Home = () => {
  const { t } = useI18n();

  return (
    <div>
      <SEO title={'Home'} />
      <p>{t('pages.home.hello')}</p>
    </div>
  );
};

export default Home;
