import { redirect } from 'next/dist/server/api-utils';

import { api } from '../../../server';
import oAuthDiscord from '../../../services/auth/Discord';

export default api({
  async GET({ res }) {
    const oAuthDiscordService = new oAuthDiscord();

    redirect(res, await oAuthDiscordService.generateAuthorizeURL('state'));
  },
});
