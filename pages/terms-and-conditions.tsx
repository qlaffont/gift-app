import Link from 'next/link';

import { SEO } from '../components/atoms/SEO';
import { useI18n } from '../i18n/useI18n';

const TermsAndConditions = () => {
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      <SEO title={t('pages.termsAndConditions.title')} />
      <h1 className="text-3xl font-bold">{t('pages.termsAndConditions.title')}</h1>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{t('pages.termsAndConditions.data.title')}</h2>
        <p>{t('pages.termsAndConditions.data.description')}</p>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{t('pages.termsAndConditions.google.title')}</h2>
        <p>{t('pages.termsAndConditions.google.description')}</p>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{t('pages.termsAndConditions.discord.title')}</h2>
        <p>{t('pages.termsAndConditions.discord.description')}</p>
      </div>

      <div>
        <Link
          href="https://www.privacypolicygenerator.info/live.php?token=MLQb6BllGqSfEZZ5tgE0jH60MBHa7jUh"
          target="_blank"
          className="font-bold hover:underline hover:opacity-60"
        >
          {t('pages.termsAndConditions.privacyPolicy')}
        </Link>
      </div>
    </div>
  );
};

export default TermsAndConditions;
