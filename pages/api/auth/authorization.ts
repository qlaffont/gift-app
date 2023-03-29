import { validateEnv } from 'env-vars-validator';
import jwt from 'jsonwebtoken';
import { NextkitError } from 'nextkit';

import { api } from '../../../server';
import { getAuthMethod, saveRefresh } from '../../../services/apis/authUser';
import oAuthDiscord from '../../../services/auth/Discord';
import oAuthGoogle from '../../../services/auth/Google';
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

      const method = getAuthMethod(req, res);

      if (!method || ['google', 'discord'].indexOf(method) === -1) {
        throw new Error('NotImplemented');
      }

      let user;

      if (method === 'google') {
        const oAuthGoogleService = new oAuthGoogle();
        const { name, email, id } = await oAuthGoogleService.fetchUser(req.query.code as string);

        // Check if user already exist
        user = await prisma.user.findFirst({
          where: {
            OR: [{ googleUserId: id }, { email }],
          },
        });

        if (!user) {
          await prisma.user.create({
            data: {
              googleUserId: id,
              email,
              name,
            },
          });
        } else {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              googleUserId: id,
            },
          });
        }
      }

      if (method === 'discord') {
        const oAuthDiscordService = new oAuthDiscord();

        const { access_token } = await oAuthDiscordService.fetchUserToken(req.query.code as string);

        const { username, email, id } = await oAuthDiscordService.fetchUserInfo(access_token);

        // Check if user already exist
        user = await prisma.user.findFirst({
          where: {
            OR: [
              {
                discordUserId: id,
              },
              { email },
            ],
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              discordUserId: id,
              email,
              name: `${username}`,
            },
          });
        } else {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              discordUserId: id,
            },
          });
        }
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

      res.redirect('/auth?accessToken=' + accessToken);
    } catch (error) {
      console.log(error);
      throw new NextkitError(400, 'Impossible to login. Try Again !');
    }
  },
});
