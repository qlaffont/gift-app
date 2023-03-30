import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

type Result = {
  url?: string | null;
  raw?: string | null;
  'og:type'?: string | null;
  'og:site_name'?: string | null;
  description?: string | null;
  'og:url'?: string | null;
  'og:title'?: string | null;
  'og:description'?: string | null;
  'og:image'?: string | null;
  'twitter:image'?: string | null;
  image?: string | null;
  video?: string | null;
  'twitter:url'?: string | null;
  'twitter:description'?: string | null;
  'twitter:title'?: string | null;
  title?: string | null;
};

export const useFetchOGDataMutation = (options?: UseMutationOptions<Result, unknown, { url: string }>) =>
  useMutation({
    mutationFn: ({ url }) =>
      fetcher({
        method: 'GET',
        url: `/api/open-graph?url=${encodeURIComponent(url)}`,
      })(),
    ...options,
  });
