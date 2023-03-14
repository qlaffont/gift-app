import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const useGetUserMeQuery = (
  variables?: undefined,
  options?: UseQueryOptions<unknown, unknown, { email: string; name: string; id: string }>,
) =>
  useQuery({
    queryKey: variables === undefined ? ['getUserMe'] : ['getUserMe', variables],
    queryFn: () =>
      fetcher({
        method: 'GET',
        url: '/api/auth/me',
      })(),
    ...options,
  });
