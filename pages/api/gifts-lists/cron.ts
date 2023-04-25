import { api } from '../../../server';
import prisma from '../../../services/prisma';

export default api({
  async GET() {
    // Delete already taken fields

    await prisma.gift.deleteMany({
      where: {
        takenWhen: {
          not: null,
        },
        giftList: {
          resetTakenWhen: {
            lte: new Date(),
          },
        },
      },
    });

    await prisma.giftList.updateMany({
      where: {
        resetTakenWhen: {
          lte: new Date(),
        },
      },
      data: {
        resetTakenWhen: null,
      },
    });

    return 'OK';
  },
});
