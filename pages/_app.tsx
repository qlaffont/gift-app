import '../scss/app.scss';

import { Transition } from '@headlessui/react';
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isDevelopmentEnv } from 'env-vars-validator';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { NextAuthProvider, useNextAuthProtectedHandler } from 'next-protected-auth';
import { useEffect } from 'react';
import { resolveValue, Toaster, ToastIcon } from 'react-hot-toast';
import { locales, RosettyProvider } from 'rosetty-react';

import { AppLayout } from '../components/layout/AppLayout';
import enDict from '../i18n/en';
import frDict from '../i18n/fr';
import { useI18n, useI18nSEO } from '../i18n/useI18n';
import { reactQueryClient } from '../services/apis/react-query/reactQueryClient';
import RestAPIService from '../services/apis/RestAPIService';
import { useUser } from '../services/useUser';

const rosettyLocales = {
  fr: { dict: frDict, locale: locales.fr },
  en: { dict: enDict, locale: locales.enGB },
};

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <QueryClientProvider client={reactQueryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="google" content="notranslate" />
          <meta name="google" content="nositelinkssearchbox" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <title>App</title>
        </Head>
        <RosettyProvider languages={rosettyLocales} defaultLanguage="en">
          <NextAuthProvider>
            <ExtendedApp {...{ Component, pageProps }} />
          </NextAuthProvider>
        </RosettyProvider>
      </Hydrate>
    </QueryClientProvider>
  </>
);

const ExtendedApp = ({ Component, pageProps }) => {
  const { changeLang } = useI18n();
  useI18nSEO();
  //@ts-ignore
  const Layout = Component.Layout ? Component.Layout : AppLayout;

  useNextAuthProtectedHandler({
    publicURLs: ['/', '/:username/:id', '/terms-and-conditions'],
    loginURL: '/auth/login',
    authCallbackURL: '/auth',
    allowNotFound: true,
    renewTokenFct: async (oldAccessToken) => {
      if (!oldAccessToken) {
        throw 'not connected';
      }

      const data = await RestAPIService.refresh();
      return data.data.token as string;
    },
  });

  const user = useUser();

  useEffect(() => {
    if (user) {
      changeLang(user?.lang?.toLowerCase() || 'en');
    }
  }, [user, changeLang]);

  return (
    <div className="h-screen w-screen overflow-auto bg-white text-black dark:bg-zinc-900 dark:text-white ">
      <Layout>
        <Component {...pageProps} />
        {isDevelopmentEnv() && <ReactQueryDevtools initialIsOpen={false} />}
      </Layout>
      <Toaster position="top-center" gutter={5}>
        {(t) => (
          <Transition
            appear
            show={t.visible}
            className="flex transform items-center rounded bg-white p-4 shadow-lg dark:bg-zinc-800 dark:text-white"
            enter="transition-all duration-150"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="transition-all duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-75"
          >
            <ToastIcon toast={t} />
            <p className="px-2">{resolveValue(t.message, t)}</p>
          </Transition>
        )}
      </Toaster>
    </div>
  );
};

export default MyApp;
