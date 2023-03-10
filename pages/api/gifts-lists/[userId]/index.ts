import { GiftListAccess } from '@prisma/client';
import { NextkitError } from 'nextkit';

import { api } from '../../../../server';
import { getUserFromReq } from '../../../../services/apis/authUser';
import prisma from '../../../../services/prisma';

export default api({
  async GET({ req }) {
    const where = [];

    where.push({
      access: GiftListAccess.PUBLIC,
      ownerId: req.query.userId as string,
    });

    if (req.headers.authorization) {
      const user = await getUserFromReq(req);
      where.push({
        access: GiftListAccess.EMAIL,
        giftListUserAccesses: {
          some: {
            ownerId: user.id,
          },
        },
        ownerId: req.query.userId as string,
      });
    }

    if (req.query.password) {
      where.push({
        access: GiftListAccess.PASSWORD_PROTECTED,
        ownerId: req.query.userId as string,
      });
    }

    return prisma.giftList.findMany({
      where: {
        OR: where,
      },
      select: {
        password: false,
      },
    });
  },
  async PUT({ req }) {
    const user = await getUserFromReq(req);

    if (!req?.body?.name) {
      throw new NextkitError(400, 'Bad Request');
    }

    return await prisma.giftList.create({
      data: {
        ...req.body,
        ownerId: user.id,
      },
    });
  },
});
