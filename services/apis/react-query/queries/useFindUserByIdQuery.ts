import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { GiftListAccess, GiftListUserAccess } from '../../../types/prisma.type';
import { fetcher } from '../fetcher';

type Return = {
  giftLists: {
    password: any;
    id: string;
    name: string;
    description: string;
    resetTakenWhen: Date;
    access: GiftListAccess;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    giftListUserAccesses: GiftListUserAccess[];
  }[];
  id: string;
  name: string;
  description: string;
};

export const findUserByIdFetcher = (variables?: { id: string }): (() => Return) => {
  return fetcher({
    method: 'GET',
    url: `/api/users/${variables.id}`,
  });
};

export const useFindUserByIdQuery = (variables?: { id: string }, options?: UseQueryOptions<unknown, unknown, Return>) =>
  useQuery({
    queryKey: variables === undefined ? ['findUserById'] : ['findUserById', variables],
    queryFn: () => findUserByIdFetcher(variables)(),
    ...options,
  });
