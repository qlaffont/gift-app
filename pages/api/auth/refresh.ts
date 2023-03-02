import { validateEnv } from 'env-vars-validator';
import jwt from 'jsonwebtoken';

import { api } from '../../../server';
import { getRefresh } from '../../../services/apis/authUser';
import prisma from '../../../services/prisma';

export default api({
  async GET({ req, res }) {
    validateEnv(
      {
        JWT_SECRET: { type: 'string' },
      },
      {
        requiredProperties: ['JWT_SECRET'],
      },
    );

    const refreshToken = await getRefresh(req, res);

    const user = await prisma.user.findFirst({
      where: {
        tokens: {
          some: {
            refreshToken,
          },
        },
      },
    });

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: `1d`, //token expire in 1 day
    });

    await prisma.token.updateMany({
      where: {
        refreshToken,
      },
      data: {
        accessToken,
      },
    });

    return { token: accessToken };
  },
});
