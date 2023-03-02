import { validateEnv } from 'env-vars-validator';
import jwt from 'jsonwebtoken';
import { NextkitError } from 'nextkit';

import { api } from '../../../server';
import { saveRefresh } from '../../../services/apis/authUser';
import oAuthDiscord from '../../../services/auth/Discord';
import prisma from '../../../services/prisma';

export default api({
  async GET({ req, res }) {
    try {
      validateEnv(
        {
          JWT_SECRET: { type: 'string' },
        },
        {
          requiredProperties: ['JWT_SECRET'],
        },
      );

      const oAuthDiscordService = new oAuthDiscord();

      const { access_token } = await oAuthDiscordService.fetchUserToken(req.query.code as string);

      const { username, email, id } = await oAuthDiscordService.fetchUserInfo(access_token);

      // Check if user already exist
      const user = await prisma.user.findFirst({
        where: {
          discordUserId: id,
        },
      });

      if (!user) {
        await prisma.user.create({
          data: {
            discordUserId: id,
            email,
            name: `${username}`,
          },
        });
      }

      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: `1d`, //token expire in 1 day
      });

      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: `15d`, //token expire in 2 weeks
      });

      await prisma.token.create({
        data: {
          accessToken,
          refreshToken,
          ownerId: user.id,
        },
      });

      await saveRefresh(refreshToken, req, res);

      res.redirect('/auth?token=' + accessToken);
    } catch (error) {
      throw new NextkitError(400, 'Impossible to login. Try Again !');
    }
  },
});
