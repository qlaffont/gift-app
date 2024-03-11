import { useEffect, useState } from 'react';
import { useIsClient } from 'usehooks-ts';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

const getPrefersScheme = (defaultValue?: boolean): boolean => {
  if (localStorage.getItem('darkMode')) {
    return localStorage.getItem('darkMode') === 'true';
  }

  // Prevents SSR issues
  if (typeof window !== 'undefined') {
    return window.matchMedia(COLOR_SCHEME_QUERY).matches;
  }

  return !!defaultValue;
};

export const useDark = (defaultValue?: boolean) => {
  const isBrowser = useIsClient();
  // const [isDarkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);
  const [isDarkMode, setDarkMode] = useState<boolean>(undefined);

  useEffect(() => {
    if (isBrowser) {
      setDarkMode(getPrefersScheme(defaultValue));
    }
  }, [isBrowser]);

  useEffect(() => {
    if (document) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-color-mode', 'dark');
        if (isBrowser) {
          localStorage.setItem('darkMode', 'true');
        }
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-color-mode', 'light');
        if (isBrowser) {
          localStorage.setItem('darkMode', 'false');
        }
      }
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    toggle: () => setDarkMode((prev) => !prev),
  };
};
