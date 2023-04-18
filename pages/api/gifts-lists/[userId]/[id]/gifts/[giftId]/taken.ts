import { NextkitError } from 'nextkit';

import { api } from '../../../../../../../server';
import { getUserFromReq } from '../../../../../../../services/apis/authUser';
import prisma from '../../../../../../../services/prisma';

export default api({
  async POST({ req }) {
    const user = await getUserFromReq(req);

    const gift = await prisma.gift.findFirst({
      where: {
        id: req.query.giftId as string,
        takenWhen: null,
        takenBy: null,
      },
      include: {
        giftList: true,
      },
    });

    if (!gift) {
      throw new NextkitError(404, 'Not found');
    }

    return prisma.gift.update({
      where: {
        id: gift.id,
      },
      data: {
        takenById: user.id,
        takenWhen: new Date(),
      },
    });
  },
});
