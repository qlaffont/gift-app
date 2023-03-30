import { NextkitError } from 'nextkit';

import { api } from '../../../server';
import { getUserFromReq } from '../../../services/apis/authUser';
import prisma from '../../../services/prisma';

export default api({
  async GET({ req }) {
    const currentUser = await getUserFromReq(req, true);

    const user = await prisma.user.findFirst({
      where: {
        id: req.query.id as string,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const giftLists = (
      await prisma.giftList.findMany({
        where: {
          ownerId: user.id,
        },
        include: {
          giftListUserAccesses: currentUser && currentUser.id === req.query.id,
        },
      })
    ).map((v) => ({ ...v, password: undefined }));

    if (!user) {
      throw new NextkitError(404, 'User not found');
    }

    const r = { ...user, giftLists };
    return r;
  },
});
