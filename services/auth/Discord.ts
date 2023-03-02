import { validateEnv } from 'env-vars-validator';
import fetch from 'node-fetch';

interface OAuthToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

interface OAuthUserInfo {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  email: string;
  verified: boolean;
  locale: string;
  mfa_enabled: boolean;
}

const CLIENT_ID = process.env.DISCORD_CLIENTID || '';
const CLIENT_SECRET = process.env.DISCORD_CLIENTSECRET || '';
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/authorization` || '';
const SCOPES = ['identify', 'email'];

class oAuthDiscord {
  DISCORD_BASE = 'https://discord.com';

  constructor() {
    validateEnv(
      {
        DISCORD_CLIENTID: { type: 'string' },
        DISCORD_CLIENTSECRET: { type: 'string' },
        NEXT_PUBLIC_BASE_URL: { type: 'string', format: 'uri' },
      },
      {
        requiredProperties: ['DISCORD_CLIENTID', 'DISCORD_CLIENTSECRET', 'NEXT_PUBLIC_BASE_URL'],
      },
    );
  }

  getGuildIconUrl(guildId, iconId) {
    return iconId ? `https://cdn.discordapp.com/icons/${guildId}/${iconId}.png` : undefined;
  }

  static getProfileIconUrl(userId, iconId) {
    return iconId ? `https://cdn.discordapp.com/avatars/${userId}/${iconId}.png` : undefined;
  }

  generateAuthorizeURL = (state: string): string => {
    const url = new URL(`/api/oauth2/authorize`, this.DISCORD_BASE);
    url.searchParams.append('client_id', CLIENT_ID);
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('state', state);
    url.searchParams.append('scope', SCOPES.join(' '));

    return url.toString();
  };

  fetchUserToken = async (code: string): Promise<OAuthToken> => {
    const params = new URLSearchParams();

    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('scope', encodeURIComponent(SCOPES.reduce((prev, current) => `${prev} ${current}`)));

    //@ts-ignore
    return fetch(`${this?.DISCORD_BASE}/api/oauth2/token`, {
      method: 'POST',
      body: params,
    }).then((resp) => resp.json());
  };

  fetchUserInfo = async (token): Promise<OAuthUserInfo> => {
    //@ts-ignore
    return fetch(`${this?.DISCORD_BASE}/api/users/@me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }).then((resp) => resp.json());
  };
}

export default oAuthDiscord;
