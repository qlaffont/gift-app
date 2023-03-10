import { api } from '../../../server';
import prisma from '../../../services/prisma';

export default api({
  async POST({ req }) {
    // Delete already taken fields

    if (req.query.token === process.env.CRON_TOKEN) {
      await prisma.gift.deleteMany({
        where: {
          takenWhen: {
            gte: new Date(),
          },
        },
      });
    }

    return 'OK';
  },
});
