import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

type Return = string[];

export const findGiftListAccessByIdQuery = (variables?: { userId: string; id: string }): (() => Return) => {
  return fetcher({
    method: 'GET',
    url: `/api/gifts-lists/${variables.userId}/${variables.id}/access`,
  });
};

export const useFindGiftListAccessByIdQuery = (
  variables?: {
    userId: string;
    id: string;
  },
  options?: UseQueryOptions<unknown, unknown, Return>,
) =>
  useQuery({
    queryKey: variables === undefined ? ['findGiftListAccessById'] : ['findGiftListAccessById', variables],
    queryFn: () => findGiftListAccessByIdQuery(variables)(),
    ...options,
  });
