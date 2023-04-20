import { api } from '../../../server';
import { getUserFromReq } from '../../../services/apis/authUser';
import prisma from '../../../services/prisma';

export default api({
  async POST({ req }) {
    const user = await getUserFromReq(req);

    const data = {
      name: req.body.name,
      description: req.body.description,
    };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data,
    });

    return 'ok';
  },
});
