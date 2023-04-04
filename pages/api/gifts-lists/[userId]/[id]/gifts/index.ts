import { NextkitError } from 'nextkit';

import { api } from '../../../../../../server';
import { getUserFromReq } from '../../../../../../services/apis/authUser';
import prisma from '../../../../../../services/prisma';

export default api({
  async PUT({ req }) {
    const user = await getUserFromReq(req);
    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.query.id as string,
      },
    });

    if (!giftList || giftList.ownerId !== user.id) {
      throw new NextkitError(404, 'Not found');
    }

    if (!req.body.name) {
      throw new NextkitError(400, 'Bad Request');
    }

    return prisma.gift.create({
      data: {
        ...req.body,
        giftListId: giftList.id,
      },
      select: {
        id: true,
      },
    });
  },
  async POST({ req }) {
    const user = await getUserFromReq(req);

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.query.id as string,
      },
      include: {
        gifts: true,
      },
    });

    if (!giftList || giftList.ownerId !== user.id) {
      throw new NextkitError(404, 'Not found');
    }

    await prisma.gift.deleteMany({
      where: {
        takenWhen: {
          not: null,
        },
        giftListId: giftList.id,
      },
    });

    return 'OK';
  },
});
