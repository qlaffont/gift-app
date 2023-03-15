import { NextkitError } from 'nextkit';

import { api } from '../../../server';
import prisma from '../../../services/prisma';

export default api({
  async GET({ req }) {
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

    if (!user) {
      throw new NextkitError(404, 'User not found');
    }

    return user;
  },
});
