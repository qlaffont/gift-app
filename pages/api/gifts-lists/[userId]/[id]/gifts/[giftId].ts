import { NextkitError } from 'nextkit';

import { api } from '../../../../../../server';
import { getUserFromReq } from '../../../../../../services/apis/authUser';
import prisma from '../../../../../../services/prisma';

export default api({
  async POST({ req }) {
    const user = await getUserFromReq(req);

    const gift = await prisma.gift.findFirst({
      where: {
        id: req.query.giftId as string,
      },
      include: {
        giftList: true,
      },
    });

    if (!gift || gift.giftList.ownerId !== user.id) {
      throw new NextkitError(404, 'Not found');
    }

    return prisma.gift.update({
      where: {
        id: gift.id,
      },
      data: {
        ...req.body,
        giftListId: gift.giftListId,
      },
    });
  },
  async DELETE({ req }) {
    const user = await getUserFromReq(req);

    const gift = await prisma.gift.findFirst({
      where: {
        id: req.query.giftId as string,
      },
      include: {
        giftList: true,
      },
    });

    if (!gift || gift.giftList.ownerId !== user.id) {
      throw new NextkitError(404, 'Not found');
    }

    await prisma.gift.delete({
      where: {
        id: gift.id,
      },
    });

    return 'OK';
  },
});
