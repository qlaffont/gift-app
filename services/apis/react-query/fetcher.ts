import { getAccessToken, getAndSaveAccessToken, removeAccessToken } from 'next-protected-auth';

import RestAPIService from '../RestAPIService';

export const fetcher = ({
  method,
  headers,
  body,
  url = '',
}: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HeadersInit;
  body?: BodyInit | null;
  url?: string;
}) => {
  return async () => {
    const allHeaders: Record<string, string> = {};

    if (getAccessToken()) {
      allHeaders.Authorization = `Bearer ${getAccessToken()}`;
    }

    allHeaders['Content-Type'] = `application/json`;

    if (headers) {
      //@ts-ignore
      for (const [k, v] of headers.entries()) {
        allHeaders[k] = v;
      }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
      method,
      headers: allHeaders,
      body,
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || 'Error..';
      if (message.includes('Access denied') || message.includes('Unauthorized')) {
        //Try to renew token
        try {
          await getAndSaveAccessToken({
            renewTokenFct: async () => {
              const { accessToken: accessToken } = await RestAPIService.refresh();

              return accessToken as string;
            },
          });

          // Try again
          return fetcher({
            method,
            headers,
            body,
            url,
          })();
        } catch (error) {
          removeAccessToken();
          window.location.href = `/auth/login?redirectURL=${encodeURIComponent(location?.pathname + location?.search)}`;
          throw new Error('Unauthorized');
        }
      }

      throw new Error(message);
    }

    return json.data;
  };
};
