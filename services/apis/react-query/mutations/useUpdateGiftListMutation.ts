import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { GiftList } from '../../../types/prisma.type';
import { fetcher } from '../fetcher';

export const useUpdateGiftListMutation = (
  options?: UseMutationOptions<unknown, unknown, { userId: string } & Partial<GiftList>>,
) =>
  useMutation({
    mutationFn: ({ userId, id, ...giftList }) =>
      fetcher({
        method: 'POST',
        url: `/api/gifts-lists/${userId}/${id}`,
        body: JSON.stringify(giftList),
      })(),
    ...options,
  });
