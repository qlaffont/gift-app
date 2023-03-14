import { Language } from '@prisma/client';
import { NextkitError } from 'nextkit';

import { api } from '../../../server';
import { getUserFromReq } from '../../../services/apis/authUser';
import prisma from '../../../services/prisma';

export default api({
  async PATCH({ req }) {
    const user = await getUserFromReq(req);

    if (Object.values(Language).indexOf(req.body.lang) === -1) {
      throw new NextkitError(400, 'Impossible to change lang. Try Again !');
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lang: req.body.lang,
      },
    });

    return 'OK';
  },
});
