import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const useUpdateUserMutation = (
  options?: UseMutationOptions<unknown, unknown, { name: string; description?: string }>,
) =>
  useMutation({
    mutationFn: (data) =>
      fetcher({
        method: 'POST',
        url: `/api/users`,
        body: JSON.stringify(data),
      })(),
    ...options,
  });
