import { isDevelopmentEnv } from 'env-vars-validator';
import dynamic from 'next/dynamic';
import { useIsClient } from 'usehooks-ts';

const DevTool = dynamic(() => import('@hookform/devtools').then((mod) => mod.DevTool), { ssr: false });

export const FormDevTools = ({ control }) => {
  const isBrowser = useIsClient();
  return <>{isDevelopmentEnv() && isBrowser && <DevTool control={control} />}</>;
};
