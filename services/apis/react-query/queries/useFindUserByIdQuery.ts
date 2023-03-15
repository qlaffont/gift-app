import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const findUserByIdFetcher = (variables?: { id: string }) => {
  return fetcher({
    method: 'GET',
    url: `/api/users/${variables.id}`,
  });
};

export const useFindUserByIdQuery = (
  variables?: { id: string },
  options?: UseQueryOptions<
    unknown,
    unknown,
    {
      id: string;
      name: string;
      description: string;
    }
  >,
) =>
  useQuery({
    queryKey: variables === undefined ? ['findUserById'] : ['findUserById', variables],
    queryFn: () => findUserByIdFetcher(variables)(),
    ...options,
  });
