import { GiftListAccess } from '@prisma/client';
import { NextkitError } from 'nextkit';

import { api } from '../../../../../server';
import { getUserFromReq } from '../../../../../services/apis/authUser';
import { CryptoUtils } from '../../../../../services/crypto.utils';
import prisma from '../../../../../services/prisma';

export default api({
  async GET({ req }) {
    const where = [];
    const user = await getUserFromReq(req, true);
    let isPasswordQuery = false;

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
      isPasswordQuery = true;
      where.push({
        id: req.query.id as string,
        access: GiftListAccess.PASSWORD_PROTECTED,
      });
    }

    if (user) {
      where.push({
        id: req.query.id as string,
        ownerId: user.id,
      });
    }

    let giftList;
    if (isPasswordQuery) {
      giftList = await prisma.giftList.findFirst({
        where: {
          OR: where,
        },
        include: {
          gifts: true,
        },
      });

      if (!(await CryptoUtils.compareArgonHash(req.query.password as string, giftList.password))) {
        throw new NextkitError(404, 'Not found');
      }
    } else {
      giftList = await prisma.giftList.findFirst({
        where: {
          OR: where,
        },
        include: {
          gifts: true,
        },
      });
    }

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
        id: req.query.id as string,
      },
    });

    if (!giftList || giftList.ownerId !== user.id) {
      throw new NextkitError(404, 'Not found');
    }

    const data = {
      ...req.body,
      ownerId: user.id,
    };

    if (data.password && data.password?.length > 0) {
      data.password = await CryptoUtils.getArgonHash(data.password as string);
    }

    await prisma.giftList.update({
      where: {
        id: giftList.id,
      },
      data,
    });

    return giftList;
  },
  async DELETE({ req }) {
    const user = await getUserFromReq(req);

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.query.id as string,
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
