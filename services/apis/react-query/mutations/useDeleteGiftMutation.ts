import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const useDeleteGiftMutation = (
  options?: UseMutationOptions<unknown, unknown, { userId: string; giftListId: string; id: string }>,
) =>
  useMutation({
    mutationFn: ({ userId, id, giftListId }) =>
      fetcher({
        method: 'DELETE',
        url: `/api/gifts-lists/${userId}/${giftListId}/gifts/${id}`,
      })(),
    ...options,
  });
