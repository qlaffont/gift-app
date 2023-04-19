import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNextAuthProtected } from 'next-protected-auth';

import { useI18n } from '../../i18n/useI18n';
import { useUpdateUserLangMutation } from '../../services/apis/react-query/mutations/useUpdateUserLangMutation';
import { useInvalidateQueries } from '../../services/apis/react-query/useInvalidateQueries';
import { Language } from '../../services/types/prisma.type';
import { useDark } from '../../services/useDark';
import { useUser } from '../../services/useUser';

const DarkModeToggler = () => {
  const { isDarkMode, toggle } = useDark();

  return (
    <button
      className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-black !bg-opacity-20 p-2 hover:opacity-70 dark:bg-white"
      onClick={() => toggle()}
    >
      <i className={`icon icon-${isDarkMode ? 'sun' : 'moon'} block h-4 w-4 bg-black dark:bg-white`}></i>
    </button>
  );
};

const LangToggler = () => {
  const { actualLang, changeLang } = useI18n();
  const { isConnected } = useNextAuthProtected();
  const invalidateQueries = useInvalidateQueries();
  const { mutate } = useUpdateUserLangMutation({
    onSuccess: () => {
      invalidateQueries(['getUserMe']);
    },
  });

  return (
    <button
      className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-black !bg-opacity-20 p-2 hover:opacity-70 dark:bg-white"
      onClick={() => {
        if (isConnected) {
          mutate({ lang: actualLang === 'fr' ? Language.EN : Language.FR });
        } else {
          changeLang((actualLang === 'fr' ? Language.EN : Language.FR).toLowerCase());
        }
      }}
    >
      <i className={`icon bg-${actualLang !== 'fr' ? 'fr' : 'en'} block h-2 w-4 bg-black dark:bg-white`}></i>
    </button>
  );
};

export const AppLayout = ({ children }: React.PropsWithChildren) => {
  const { isConnected } = useNextAuthProtected();
  const { t } = useI18n();
  const { asPath } = useRouter();
  const user = useUser();

  return (
    <div>
      <div className="w-full py-6 shadow-2xl">
        <div className="container m-auto flex flex-wrap items-center justify-center gap-4 px-4 sm:justify-between">
          <div>
            <Link href="/" className="hover:opacity-70">
              <i className="brand icon-logo block h-6 w-36 bg-black dark:bg-white"></i>
            </Link>
          </div>

          {isConnected ? (
            <div className="flex flex-wrap items-center gap-2 ">
              <DarkModeToggler />

              <LangToggler />

              <Link href={`/${user?.name}/${user?.id}`}>
                <div className="flex items-center gap-1 hover:opacity-70">
                  <div>
                    <i className="icon icon-user-list mb-2 block h-5 w-6 bg-black dark:bg-white"></i>
                  </div>
                  <div>
                    <p className="hidden font-bold sm:block">{t('navbar.profile', { username: user?.name })}</p>
                  </div>
                </div>
              </Link>

              <Link href="/auth/logout">
                <div className="flex items-center gap-1 hover:opacity-70">
                  <div>
                    <i className="icon icon-logout mb-2 block h-5 w-6 bg-black dark:bg-white"></i>
                  </div>
                  <div>
                    <p className="hidden font-bold sm:block">{t('navbar.logout')}</p>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 ">
              {/* <DarkModeToggler /> */}

              <LangToggler />

              <Link href={`/auth/login?redirectURL=${asPath}`}>
                <div className="flex items-center gap-1 hover:opacity-70">
                  <div>
                    <i className="icon icon-login mb-2 block h-5 w-6 bg-black dark:bg-white"></i>
                  </div>
                  <div>
                    <p className="font-bold">{t('navbar.login')}</p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="container m-auto !px-4 !pt-8">{children}</div>
    </div>
  );
};
