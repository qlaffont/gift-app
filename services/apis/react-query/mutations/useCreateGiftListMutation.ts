import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { GiftList } from '../../../types/prisma.type';
import { fetcher } from '../fetcher';

export const useCreateGiftListMutation = (
  options?: UseMutationOptions<unknown, unknown, { userId: string } & Partial<GiftList>>,
) =>
  useMutation({
    mutationFn: ({ userId, ...giftList }) =>
      fetcher({
        method: 'PUT',
        url: `/api/gifts-lists/${userId}`,
        body: JSON.stringify(giftList),
      })(),
    ...options,
  });
