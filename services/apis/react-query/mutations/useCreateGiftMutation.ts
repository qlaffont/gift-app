import { Gift } from '@prisma/client';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const useCreateGiftMutation = (
  options?: UseMutationOptions<unknown, unknown, { userId: string; giftListId: string } & Partial<Gift>>,
) =>
  useMutation({
    mutationFn: ({ userId, giftListId, ...gift }) =>
      fetcher({
        method: 'PUT',
        url: `/api/gifts-lists/${userId}/${giftListId}/gifts`,
        body: JSON.stringify(gift),
      })(),
    ...options,
  });
