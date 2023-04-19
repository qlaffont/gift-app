import { validateEnv } from 'env-vars-validator';
import { google } from 'googleapis';
const CLIENT_ID = process.env.GOOGLE_CLIENTID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENTSECRET || '';
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/authorization` || '';
import jwt from 'jsonwebtoken';

class oAuthGoogle {
  GOOGLE_BASE = 'https://google.com';

  constructor() {
    validateEnv(
      {
        GOOGLE_CLIENTID: { type: 'string' },
        GOOGLE_CLIENTSECRET: { type: 'string' },
        NEXT_PUBLIC_BASE_URL: { type: 'string', format: 'uri' },
      },
      {
        requiredProperties: ['GOOGLE_CLIENTID', 'GOOGLE_CLIENTSECRET', 'NEXT_PUBLIC_BASE_URL'],
      },
    );
  }

  generateAuthorizeURL = (state: string): string => {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    // Access scopes for read-only Drive activity.
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
      state,
    });

    return authorizationUrl;
  };

  fetchUser = async (code: string): Promise<any> => {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const people = google.people('v1');

    const user = await people.people.get({
      access_token: tokens.access_token,
      resourceName: 'people/me',
      personFields: 'emailAddresses',
    });

    const dataToken = jwt.decode(tokens.id_token);

    console.log(dataToken);

    return {
      email: user.data.emailAddresses[0].value,
      name: dataToken.name,
      id: dataToken.sub,
    };
  };
}

export default oAuthGoogle;
