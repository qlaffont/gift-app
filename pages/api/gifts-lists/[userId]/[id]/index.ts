import { GiftListAccess } from '@prisma/client';
import { NextkitError } from 'nextkit';

import { api } from '../../../../../server';
import { getUserFromReq } from '../../../../../services/apis/authUser';
import { CryptoUtils } from '../../../../../services/crypto.utils';
import prisma from '../../../../../services/prisma';

export default api({
  async GET({ req }) {
    const where = [];

    where.push({
      id: req.query.id as string,
      access: GiftListAccess.PUBLIC,
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
        id: req.query.id as string,
      });
    }

    if (req.query.password) {
      where.push({
        id: req.query.id as string,
        access: GiftListAccess.PASSWORD_PROTECTED,
        password: await CryptoUtils.getArgonHash(req.query.password as string),
      });
    }

    const giftList = await prisma.giftList.findFirst({
      where: {
        OR: where,
      },
      include: {
        gifts: true,
      },
    });

    if (giftList) {
      giftList.password = undefined;
    } else {
      throw new NextkitError(404, 'Not found');
    }

    return giftList;
  },
  async POST({ req }) {
    const user = await getUserFromReq(req);

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.body.id as string,
      },
    });

    if (!giftList || giftList.ownerId !== user.id) {
      throw new NextkitError(404, 'Not found');
    }

    await prisma.giftList.update({
      where: {
        id: giftList.id,
      },
      data: {
        ...req.body,
        ownerId: user.id,
      },
    });

    return giftList;
  },
  async DELETE({ req }) {
    const user = await getUserFromReq(req);

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.body.id as string,
      },
    });

    if (!giftList || giftList.ownerId !== user.id) {
      throw new NextkitError(404, 'Not found');
    }

    await prisma.giftList.delete({
      where: {
        id: giftList.id,
      },
    });

    return 'OK';
  },
});
