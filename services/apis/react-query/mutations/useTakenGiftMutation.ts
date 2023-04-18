import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const useTakenGiftMutation = (
  options?: UseMutationOptions<unknown, unknown, { userId: string; giftListId: string; id: string }>,
) =>
  useMutation({
    mutationFn: ({ userId, giftListId, id }) =>
      fetcher({
        method: 'POST',
        url: `/api/gifts-lists/${userId}/${giftListId}/gifts/${id}/taken`,
      })(),
    ...options,
  });
