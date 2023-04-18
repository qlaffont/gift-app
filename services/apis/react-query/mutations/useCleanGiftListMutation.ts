import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const useCleanGiftListMutation = (
  options?: UseMutationOptions<unknown, unknown, { userId: string; id: string }>,
) =>
  useMutation({
    mutationFn: ({ userId, id }) =>
      fetcher({
        method: 'POST',
        url: `/api/gifts-lists/${userId}/${id}/clean`,
      })(),
    ...options,
  });
