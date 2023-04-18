import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { Gift } from '../../../types/prisma.type';
import { fetcher } from '../fetcher';

export const useUpdateGiftMutation = (
  options?: UseMutationOptions<unknown, unknown, { userId: string; giftListId: string } & Partial<Gift>>,
) =>
  useMutation({
    mutationFn: ({ userId, giftListId, id, ...gift }) =>
      fetcher({
        method: 'POST',
        url: `/api/gifts-lists/${userId}/${giftListId}/gifts/${id}`,
        body: JSON.stringify(gift),
      })(),
    ...options,
  });
