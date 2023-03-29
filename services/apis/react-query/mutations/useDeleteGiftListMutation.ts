import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const useDeleteGiftListMutation = (
  options?: UseMutationOptions<unknown, unknown, { userId: string; id: string }>,
) =>
  useMutation({
    mutationFn: ({ userId, id }) =>
      fetcher({
        method: 'DELETE',
        url: `/api/gifts-lists/${userId}/${id}`,
      })(),
    ...options,
  });
