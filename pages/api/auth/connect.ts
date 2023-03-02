import { api } from '../../../server';
import { saveAuthMethod } from '../../../services/apis/authUser';
import oAuthDiscord from '../../../services/auth/Discord';
import oAuthGoogle from '../../../services/auth/Google';

export default api({
  async GET({ req, res }) {
    if (req.query.method === 'google') {
      saveAuthMethod('google', req, res);
      const oAuthGoogleService = new oAuthGoogle();
      res.redirect(await oAuthGoogleService.generateAuthorizeURL('state'));
    } else {
      saveAuthMethod('discord', req, res);
      const oAuthDiscordService = new oAuthDiscord();
      res.redirect(await oAuthDiscordService.generateAuthorizeURL('state'));
    }
  },
});
