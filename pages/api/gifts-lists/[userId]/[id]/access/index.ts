import { NextkitError } from 'nextkit';

import { api } from '../../../../../../server';
import { getUserFromReq } from '../../../../../../services/apis/authUser';
import prisma from '../../../../../../services/prisma';

export default api({
  async GET({ req }) {
    const user = await getUserFromReq(req);

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.query.id as string,
        ownerId: user.id,
      },
      include: {
        giftListUserAccesses: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!giftList) {
      throw new NextkitError(404, 'Not found');
    }

    return giftList?.giftListUserAccesses?.map((e) => e.owner.email);
  },
  async PUT({ req }) {
    const user = await getUserFromReq(req);

    if (!req.body.email || req.body.email.length === 0) {
      throw new NextkitError(400, 'Not found');
    }

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.query.id as string,
        ownerId: user.id,
      },
      include: {
        giftListUserAccesses: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!giftList) {
      throw new NextkitError(404, 'Not found');
    }

    if (!giftList.giftListUserAccesses.find((v) => v.owner.email === req.body.email)) {
      const user = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        throw new NextkitError(404, 'Not found');
      }

      await prisma.giftListUserAccess.create({
        data: {
          giftListId: giftList.id,
          ownerId: user.id,
        },
      });
    }

    return 'OK';
  },
  async DELETE({ req }) {
    const user = await getUserFromReq(req);

    if (!req.body.email || req.body.email.length === 0) {
      throw new NextkitError(400, 'Not found');
    }

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.query.id as string,
        ownerId: user.id,
      },
      include: {
        giftListUserAccesses: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!giftList) {
      throw new NextkitError(404, 'Not found');
    }

    await prisma.giftListUserAccess.deleteMany({
      where: {
        giftListId: giftList.id,
        owner: {
          email: req.body.email,
        },
      },
    });

    return 'OK';
  },
});
