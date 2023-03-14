import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNextAuthProtected } from 'next-protected-auth';

import { useI18n } from '../../i18n/useI18n';
import { useDark } from '../../services/useDark';
import { useUser } from '../../services/useUser';

const DarkModeToggler = () => {
  const { isDarkMode, toggle } = useDark();

  return (
    <button className=" rounded-full p-1" onClick={() => toggle()}>
      <i className={`icon icon-${isDarkMode ? 'sun' : 'moon'} mb-1 block h-4 w-4 bg-black dark:bg-white`}></i>
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
        <div className="container m-auto flex flex-wrap justify-between px-4">
          <div>Gift App</div>

          {isConnected ? (
            <div className="flex flex-wrap items-center gap-2 ">
              <DarkModeToggler />

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
              <DarkModeToggler />

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

      <div className="container m-auto pt-4">{children}</div>
    </div>
  );
};
