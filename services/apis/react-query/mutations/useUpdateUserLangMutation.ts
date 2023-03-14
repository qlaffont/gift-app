import { Language } from '@prisma/client';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { fetcher } from '../fetcher';

export const useUpdateUserLangMutation = (options?: UseMutationOptions<unknown, unknown, { lang: Language }>) =>
  useMutation({
    mutationFn: (variables) =>
      fetcher({
        method: 'PATCH',
        url: '/api/auth/change-lang',
        body: JSON.stringify(variables),
      })(),
    ...options,
  });
