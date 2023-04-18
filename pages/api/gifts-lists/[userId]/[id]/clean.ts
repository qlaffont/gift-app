import { NextkitError } from 'nextkit';

import { api } from '../../../../../server';
import { getUserFromReq } from '../../../../../services/apis/authUser';
import prisma from '../../../../../services/prisma';

export default api({
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

    await prisma.gift.deleteMany({
      where: {
        giftListId: giftList.id,
        takenWhen: {
          not: null,
        },
      },
    });

    return 'ok';
  },
});
