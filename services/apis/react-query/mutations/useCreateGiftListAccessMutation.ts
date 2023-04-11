import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const useCreateGiftListAccessMutation = (
  options?: UseMutationOptions<unknown, unknown, { userId: string; giftListId: string } & { email: string }>,
) =>
  useMutation({
    mutationFn: ({ userId, giftListId, email }) =>
      fetcher({
        method: 'PUT',
        url: `/api/gifts-lists/${userId}/${giftListId}/access`,
        body: JSON.stringify({ email }),
      })(),
    ...options,
  });
