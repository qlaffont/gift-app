import { getCookie, removeCookies, setCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextkitError } from 'nextkit';

import prisma from '../prisma';

export const getUserFromReq = async (req: NextApiRequest) => {
  if (!req.headers.authorization) {
    throw new NextkitError(401, 'Forbidden');
  }

  const token = req.headers.authorization.replace('Bearer ', '').trim();

  if (token.length === 0) {
    throw new NextkitError(401, 'Forbidden');
  }

  const t = await prisma.token.findFirst({ where: { accessToken: token } });

  if (!t) {
    throw new NextkitError(401, 'Forbidden');
  }

  if (!jwt.verify(token, process.env.JWT_SECRET)) {
    await prisma.token.delete({
      where: {
        id: t.id,
      },
    });
    throw new NextkitError(401, 'Forbidden');
  }

  return prisma.user.findFirst({
    where: {
      id: t.ownerId,
    },
  });
};

export const saveRefresh = (refreshToken: string, req: NextApiRequest, res: NextApiResponse) => {
  setCookie('refresh', refreshToken, {
    req,
    res,
    httpOnly: true,
  });
};

export const removeRefresh = (req: NextApiRequest, res: NextApiResponse) => {
  removeCookies('refresh', {
    req,
    res,
    httpOnly: true,
  });
};

export const getRefresh = async (req: NextApiRequest, res: NextApiResponse) => {
  const refresh = getCookie('refresh', {
    req,
    res,
    httpOnly: true,
  }) as string;

  if (!refresh || refresh.length === 0) {
    throw new NextkitError(401, 'Forbidden');
  }

  const t = await prisma.token.findFirst({ where: { refreshToken: refresh } });

  if (!t) {
    throw new NextkitError(401, 'Forbidden');
  }

  if (!jwt.verify(refresh, process.env.JWT_SECRET)) {
    await prisma.token.delete({
      where: {
        id: t.id,
      },
    });
    removeRefresh(req, res);
    throw new NextkitError(401, 'Forbidden');
  }

  return refresh;
};
