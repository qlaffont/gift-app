import { useNextAuthProtected } from 'next-protected-auth';

import { useGetUserMeQuery } from './apis/react-query/queries/useGetUserMeQuery';

export const useUser = () => {
  const { isConnected } = useNextAuthProtected();
  //@ts-ignore
  const { data: connectedUser } = useGetUserMeQuery(undefined, { enabled: isConnected });

  return connectedUser;
};
