import { Gift } from '@prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { GiftListAccess } from '../../../types/prisma.type';
import { fetcher } from '../fetcher';

type Return = {
  password: any;
  id: string;
  name: string;
  description: string;
  resetTakenWhen: Date;
  access: GiftListAccess;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  gifts: Gift[];
};

export const findGiftListByIdFetcher = (variables?: {
  userId: string;
  id: string;
  password?: string;
}): (() => Return) => {
  return fetcher({
    method: 'GET',
    url: `/api/gifts-lists/${variables.userId}/${variables.id}${
      variables.password ? `?password=${encodeURIComponent(variables.password)}` : ''
    }`,
  });
};

export const useFindGiftListByIdQuery = (
  variables?: {
    userId: string;
    id: string;
    password?: string;
  },
  options?: UseQueryOptions<unknown, unknown, Return>,
) =>
  useQuery({
    queryKey: variables === undefined ? ['findGiftListById'] : ['findGiftListById', variables],
    queryFn: () => findGiftListByIdFetcher(variables)(),
    ...options,
  });
