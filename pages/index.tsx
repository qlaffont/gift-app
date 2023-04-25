import Lottie from 'lottie-react';
import { useRef } from 'react';

import { SEO } from '../components/atoms/SEO';
import { useI18n } from '../i18n/useI18n';
import LottieEmail from '../public/lottie/email.json';
import LottieGiftIdea from '../public/lottie/gift-idea.json';
import LottieHappyGiftBox from '../public/lottie/happy-gift-box.json';
import LottieShare from '../public/lottie/share.json';

const Home = () => {
  const { t } = useI18n();

  const lottieEmail = useRef(null);

  return (
    <div className="space-y-12">
      <SEO title={t('pages.home.title')} />

      <div className="space-y-6">
        <Lottie loop={true} animationData={LottieHappyGiftBox} className="h-32" />

        <h1 className="animate-pulse text-center text-xl font-bold uppercase">{t('pages.home.title')}</h1>
      </div>

      <div className="mx-auto max-w-[700px] space-y-6">
        <div className="flex items-center gap-2">
          <div>
            <Lottie
              loop={true}
              animationData={LottieEmail}
              className="h-24 w-24"
              lottieRef={lottieEmail}
              onDOMLoaded={() => lottieEmail.current?.setSpeed(0.75)}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('pages.home.step1.title')}</h2>
            <p>{t('pages.home.step1.description')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <Lottie loop={true} animationData={LottieGiftIdea} className="h-24 w-24" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('pages.home.step2.title')}</h2>
            <p>{t('pages.home.step2.description')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <Lottie loop={true} animationData={LottieShare} className="h-24 w-24" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('pages.home.step3.title')}</h2>
            <p>{t('pages.home.step3.description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
